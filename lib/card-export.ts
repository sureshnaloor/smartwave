import * as htmlToImage from "html-to-image"

export const DEFAULT_CARD_EXPORT_WIDTH = 1050
export const DEFAULT_CARD_EXPORT_HEIGHT = 600
export const CARD_ASPECT_RATIO = DEFAULT_CARD_EXPORT_WIDTH / DEFAULT_CARD_EXPORT_HEIGHT

type CaptureOptions = {
  isBackFace?: boolean
}

function waitForImage(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve()
      return
    }
    img.onload = () => resolve()
    img.onerror = () => resolve()
  })
}

async function bakeImageToDataUrl(img: HTMLImageElement): Promise<string | null> {
  if (!img.naturalWidth || !img.naturalHeight) return null
  try {
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL("image/png")
  } catch {
    return null
  }
}

async function ensureImagesReady(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"))

  await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.src
      if (!src) return

      if (src.startsWith("data:")) {
        await waitForImage(img)
        return
      }

      await waitForImage(img)

      if (img.complete && img.naturalWidth > 0) {
        const baked = await bakeImageToDataUrl(img)
        if (baked) {
          img.src = baked
          img.removeAttribute("srcset")
          await waitForImage(img)
          return
        }
      }

      try {
        const response = await fetch(src, { mode: "cors", cache: "no-cache" })
        if (!response.ok) return
        const blob = await response.blob()
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        img.src = dataUrl
        img.removeAttribute("srcset")
        await waitForImage(img)
      } catch {
        img.crossOrigin = "anonymous"
        await waitForImage(img)
      }
    })
  )
}

function resizeDataUrl(
  dataUrl: string,
  width: number,
  height: number,
  mimeType: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not create canvas context"))
        return
      }
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL(mimeType, quality))
    }
    img.onerror = () => reject(new Error("Failed to load captured image for resize"))
    img.src = dataUrl
  })
}

function getContainerDimensions(container: HTMLElement) {
  const rect = container.getBoundingClientRect()
  const width = rect.width || container.clientWidth
  const height = rect.height || container.clientHeight
  return { width, height }
}

type StyleSnapshot = {
  className: string
  visibility: string
  display: string
  transform: string
  backfaceVisibility: string
  overflow: string
}

function snapshotStyles(element: HTMLElement): StyleSnapshot {
  return {
    className: element.className,
    visibility: element.style.visibility,
    display: element.style.display,
    transform: element.style.transform,
    backfaceVisibility: element.style.backfaceVisibility,
    overflow: element.style.overflow,
  }
}

function restoreStyles(element: HTMLElement, snapshot: StyleSnapshot) {
  element.className = snapshot.className
  element.style.visibility = snapshot.visibility
  element.style.display = snapshot.display
  element.style.transform = snapshot.transform
  element.style.backfaceVisibility = snapshot.backfaceVisibility
  element.style.overflow = snapshot.overflow
}

function applyCaptureStyles(element: HTMLElement, options?: CaptureOptions) {
  element.classList.remove("hidden", "backface-hidden")
  if (options?.isBackFace) {
    element.classList.remove("rotate-y-180")
  }
  element.style.visibility = "visible"
  element.style.transform = "none"
  element.style.backfaceVisibility = "visible"
  element.style.overflow = "visible"
}

export async function settleLayout(): Promise<void> {
  await document.fonts.ready
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

export function preloadImageUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

/**
 * Captures a visible card face as JPEG, scaled to target dimensions.
 * Caller must make the element visible and hide the opposite face first.
 */
export async function captureCardElement(
  element: HTMLElement,
  containerElement: HTMLElement,
  targetWidth: number,
  targetHeight: number,
  options?: CaptureOptions
): Promise<string> {
  const { width: sourceWidth } = getContainerDimensions(containerElement)

  if (sourceWidth <= 0) {
    throw new Error("Card container has zero dimensions")
  }

  const snapshot = snapshotStyles(element)
  applyCaptureStyles(element, options)

  try {
    await settleLayout()
    await ensureImagesReady(element)
    await settleLayout()

    const pixelRatio = Math.max(1, targetWidth / sourceWidth)

    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio,
      cacheBust: true,
      skipFonts: false,
      fetchRequestInit: {
        mode: "cors",
        cache: "no-cache",
      },
      style: {
        transform: "none",
        animation: "none",
        transition: "none",
        backfaceVisibility: "visible",
        overflow: "visible",
      },
    })

    return resizeDataUrl(dataUrl, targetWidth, targetHeight, "image/jpeg", 0.95)
  } finally {
    restoreStyles(element, snapshot)
  }
}

export function getDisplayExportDimensions(element: HTMLElement | null): {
  width: number
  height: number
} {
  if (!element) {
    return { width: DEFAULT_CARD_EXPORT_WIDTH, height: DEFAULT_CARD_EXPORT_HEIGHT }
  }

  const { width, height } = getContainerDimensions(element)
  if (width <= 0 || height <= 0) {
    return { width: DEFAULT_CARD_EXPORT_WIDTH, height: DEFAULT_CARD_EXPORT_HEIGHT }
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  }
}

export function dimensionsFromWidth(width: number, lockAspectRatio: boolean, height: number) {
  if (!lockAspectRatio) {
    return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) }
  }
  return {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(width / CARD_ASPECT_RATIO)),
  }
}

export function dimensionsFromHeight(height: number, lockAspectRatio: boolean, width: number) {
  if (!lockAspectRatio) {
    return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) }
  }
  return {
    width: Math.max(1, Math.round(height * CARD_ASPECT_RATIO)),
    height: Math.max(1, Math.round(height)),
  }
}

export function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  link.click()
}

export async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], filename, { type: "image/jpeg" })
}

export type ShareCardResult = "shared" | "downloaded" | "cancelled"

/**
 * Opens the native share sheet with the card JPEG (WhatsApp, Mail, AirDrop, Save to Photos, etc.).
 * Falls back to download when file sharing is unavailable.
 */
export async function shareCardImage(
  dataUrl: string,
  filename: string,
  title: string
): Promise<ShareCardResult> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    triggerDownload(dataUrl, filename)
    return "downloaded"
  }

  const file = await dataUrlToFile(dataUrl, filename)
  const shareData = { files: [file], title, text: title }

  if (typeof navigator.canShare === "function" && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      return "shared"
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled"
      throw err
    }
  }

  triggerDownload(dataUrl, filename)
  return "downloaded"
}

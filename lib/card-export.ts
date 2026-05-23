import * as htmlToImage from "html-to-image"

export const DEFAULT_CARD_EXPORT_WIDTH = 1050
export const DEFAULT_CARD_EXPORT_HEIGHT = 600
export const CARD_ASPECT_RATIO = DEFAULT_CARD_EXPORT_WIDTH / DEFAULT_CARD_EXPORT_HEIGHT

type CaptureOptions = {
  isBackFace?: boolean
}

type ImageSnapshot = {
  img: HTMLImageElement
  src: string
  srcset: string | null
  crossOrigin: string | null
}

function waitForImage(img: HTMLImageElement, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(true)
      return
    }

    const timer = window.setTimeout(() => resolve(false), timeoutMs)
    img.onload = () => {
      window.clearTimeout(timer)
      resolve(img.naturalWidth > 0)
    }
    img.onerror = () => {
      window.clearTimeout(timer)
      resolve(false)
    }
  })
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function resolveAbsoluteUrl(url: string): string {
  if (url.startsWith("data:")) return url
  if (url.startsWith("//")) return `${window.location.protocol}${url}`
  if (url.startsWith("/")) return `${window.location.origin}${url}`
  return url
}

/**
 * Fetches an image through same-origin proxy (for CORS-blocked URLs like Google photos)
 * or direct fetch, returning a data URL safe for canvas / html-to-image export.
 */
export async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  const absoluteUrl = resolveAbsoluteUrl(url)
  if (absoluteUrl.startsWith("data:")) return absoluteUrl

  try {
    const proxyResponse = await fetch(
      `/api/image-proxy?url=${encodeURIComponent(absoluteUrl)}`,
      { credentials: "same-origin", cache: "no-store" }
    )
    if (proxyResponse.ok) {
      return blobToDataUrl(await proxyResponse.blob())
    }
  } catch {
    // fall through to direct fetch
  }

  try {
    const directResponse = await fetch(absoluteUrl, { mode: "cors", cache: "no-store" })
    if (directResponse.ok) {
      return blobToDataUrl(await directResponse.blob())
    }
  } catch {
    // fall through
  }

  return null
}

async function inlineImagesForExport(element: HTMLElement): Promise<ImageSnapshot[]> {
  const images = Array.from(element.querySelectorAll("img"))
  const snapshots: ImageSnapshot[] = []

  await Promise.all(
    images.map(async (img) => {
      const originalSrc = img.currentSrc || img.src
      if (!originalSrc) return

      snapshots.push({
        img,
        src: originalSrc,
        srcset: img.getAttribute("srcset"),
        crossOrigin: img.getAttribute("crossorigin"),
      })

      const dataUrl = await fetchImageAsDataUrl(originalSrc)
      if (!dataUrl) return

      img.src = dataUrl
      img.removeAttribute("srcset")
      img.removeAttribute("crossorigin")
      await waitForImage(img)
    })
  )

  return snapshots
}

function restoreInlineImages(snapshots: ImageSnapshot[]) {
  for (const { img, src, srcset, crossOrigin } of snapshots) {
    img.src = src
    if (srcset) {
      img.setAttribute("srcset", srcset)
    } else {
      img.removeAttribute("srcset")
    }
    if (crossOrigin) {
      img.setAttribute("crossorigin", crossOrigin)
    } else {
      img.removeAttribute("crossorigin")
    }
  }
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
  return fetchImageAsDataUrl(url).then(() => undefined)
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
  let imageSnapshots: ImageSnapshot[] = []

  try {
    await settleLayout()
    imageSnapshots = await inlineImagesForExport(element)
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
    restoreInlineImages(imageSnapshots)
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

type ShareCardItem = {
  dataUrl: string
  filename: string
}

async function shareFilesWithFallback(
  files: File[],
  items: ShareCardItem[],
  title: string
): Promise<ShareCardResult> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    for (const item of items) {
      triggerDownload(item.dataUrl, item.filename)
    }
    return "downloaded"
  }

  const shareData = { files, title, text: title }

  if (typeof navigator.canShare === "function" && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      return "shared"
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled"
      throw err
    }
  }

  for (const item of items) {
    triggerDownload(item.dataUrl, item.filename)
  }
  return "downloaded"
}

/**
 * Opens the native share sheet with one or more card JPEGs.
 * Falls back to download when file sharing is unavailable.
 */
export async function shareCardImages(
  items: ShareCardItem[],
  title: string
): Promise<ShareCardResult> {
  if (items.length === 0) return "cancelled"

  const files = await Promise.all(
    items.map((item) => dataUrlToFile(item.dataUrl, item.filename))
  )

  return shareFilesWithFallback(files, items, title)
}

/**
 * Opens the native share sheet with the card JPEG (WhatsApp, Mail, AirDrop, Save to Photos, etc.).
 * Falls back to download when file sharing is unavailable.
 */
export async function shareCardImage(
  dataUrl: string,
  filename: string,
  title: string
): Promise<ShareCardResult> {
  return shareCardImages([{ dataUrl, filename }], title)
}

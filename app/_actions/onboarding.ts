'use server'

import { getProfile, ProfileData } from './profile';

export type StepStatus = 'completed' | 'in-progress' | 'pending';

export type OnboardingStep = {
    id: number;
    status: StepStatus;
};

export type OnboardingProgress = {
    steps: OnboardingStep[];
    completedCount: number;
    totalSteps: number;
    progressPercentage: number;
};

/**
 * Calculate onboarding progress based on user's profile data
 */
export async function getOnboardingProgress(userEmail: string): Promise<OnboardingProgress> {
    const profile = await getProfile(userEmail);

    // Default progress for new users
    if (!profile) {
        return {
            steps: [
                { id: 1, status: 'in-progress' },
                { id: 2, status: 'pending' },
                { id: 3, status: 'pending' },
                { id: 4, status: 'pending' },
                { id: 5, status: 'pending' },
            ],
            completedCount: 0,
            totalSteps: 5,
            progressPercentage: 0,
        };
    }

    const steps: OnboardingStep[] = [];

    // Step 1: Complete Your Profile
    // Check if basic profile fields are filled
    const hasBasicInfo = !!(
        profile.firstName &&
        profile.lastName &&
        profile.title
    );
    const hasPhoto = !!profile.photo;
    const hasContact = !!(
        profile.workEmail ||
        profile.personalEmail ||
        profile.mobile ||
        profile.workPhone
    );

    const step1Complete = hasBasicInfo && hasPhoto && hasContact;
    steps.push({
        id: 1,
        status: step1Complete ? 'completed' : 'in-progress'
    });

    // Step 2: Customize Your Design
    // Check if user has generated their public profile (shorturl exists)
    const step2Complete = !!profile.shorturl;
    steps.push({
        id: 2,
        status: step2Complete ? 'completed' : (step1Complete ? 'in-progress' : 'pending')
    });

    // Step 3: Add Social Links
    // Count how many social media links are added
    const socialLinks = [
        profile.linkedin,
        profile.twitter,
        profile.facebook,
        profile.instagram,
        profile.youtube,
        profile.website
    ].filter(link => link && link.trim() !== '');

    const step3Complete = socialLinks.length >= 2;
    steps.push({
        id: 3,
        status: step3Complete ? 'completed' : (step2Complete ? 'in-progress' : 'pending')
    });

    // Step 4: Generate Your Digital Card
    // Same as step 2 - having a shorturl means digital card is generated
    const step4Complete = !!profile.shorturl;
    steps.push({
        id: 4,
        status: step4Complete ? 'completed' : (step3Complete ? 'in-progress' : 'pending')
    });

    // Step 5: Share & Network
    // This is more of an ongoing activity - mark as in-progress if previous steps are done
    // We could track this later with analytics/sharing data
    const allPreviousComplete = step1Complete && step2Complete && step3Complete && step4Complete;
    steps.push({
        id: 5,
        status: allPreviousComplete ? 'in-progress' : 'pending'
    });

    // Calculate progress
    const completedCount = steps.filter(step => step.status === 'completed').length;
    const progressPercentage = Math.round((completedCount / 5) * 100);

    return {
        steps,
        completedCount,
        totalSteps: 5,
        progressPercentage,
    };
}

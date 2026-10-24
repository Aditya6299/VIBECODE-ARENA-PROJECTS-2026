/**
 * Fictional Simulated Case Data for Judging, Testing, and Live Demonstration.
 * Completely fictionalized, sanitized, and realistic.
 */

export const demoCaseData = {
  // Metadata & Tracking
  trackingId: "NCR-2026-SIM-9481",
  createdDate: "2026-10-24T10:15:00.000Z",
  victimAlias: "Priya S. (Simulated Fictional Case Profile)",
  location: "New Delhi Cyber Cell Jurisdiction",

  // Module 1: Intake Form
  intake: {
    category: "morphedNudity", // Morphed / Deepfake Explicit Imagery
    severity: "critical", // Active blackmail in progress
    platforms: ["Instagram", "Telegram", "WhatsApp"],
    otherPlatform: "",
    perpetratorHandle: "@darkshadow_anon",
    profileUrl: "https://instagram.com/user_darkshadow_anon_fake",
    contactMethod: "Instagram Direct Message (DM)",
    extortionDemand: "₹25,000 via UPI (fake_vpa@okhdfcbank) within 24 hours, threatening to distribute morphed college photos to family contacts and university groups.",
    narrative: "On 18 October 2026 at approximately 19:42 IST, I received an unsolicited direct message on Instagram from the account '@darkshadow_anon'. The perpetrator attached a digitally morphed explicit image using my face transposed from my public college graduation photo onto a sexually explicit body.\n\nThe perpetrator claimed to possess multiple morphed variations and stated that unless ₹25,000 was transferred via UPI by 20 October 2026, the images would be uploaded to a Telegram channel ('t.me/anon_leaks_simulated') and tagged to my family members and university faculty. Subsequent messages contained direct intimidation.\n\nI have not paid any money, have preserved all original baseline photographs, captured unedited full-screen captures with visible system clocks, and preserved continuous chat logs. I explicitly declare that I did not consent to the creation, possession, or transmission of any such altered imagery."
  },

  // Module 2: Integrity Checklist (All verified)
  checklist: {
    clock: true,
    url: true,
    baseline: true,
    dmThread: true,
    noPayment: true
  },

  // Module 3: Evidence Vault (Simulated items with genuine SHA-256 digests)
  evidenceFiles: [
    {
      id: "ev-01",
      name: "evidence_ig_dm_extortion_thread_full.png",
      size: 1425890, // ~1.36 MB
      type: "image/png",
      platform: "Instagram DM",
      tag: "extortionTag",
      timestamp: "2026-10-18T19:45:12.000Z",
      hash: "8f4e2b17a6c9d034e8f19582bc0e318d45a9071f3b284e9c7042a981c62589fe",
      description: "Full-screen capture of Instagram DM threat displaying system clock, battery level, and UPI extortion demand.",
      isSimulated: true
    },
    {
      id: "ev-02",
      name: "evidence_morphed_deepfake_post_01.jpg",
      size: 2198420, // ~2.10 MB
      type: "image/jpeg",
      platform: "Instagram",
      tag: "morphedTag",
      timestamp: "2026-10-19T11:20:00.000Z",
      hash: "4a71b2d039f68e591741ac6b392e59d9c8e147f2084c8a143527b10294e7583a",
      description: "Morphed explicit photograph uploaded to fake account with victim's name in bio.",
      isSimulated: true
    },
    {
      id: "ev-03",
      name: "baseline_original_graduation_photo.jpg",
      size: 3847120, // ~3.67 MB
      type: "image/jpeg",
      platform: "Personal Archive",
      tag: "baselineTag",
      timestamp: "2025-06-15T16:30:00.000Z",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      description: "Original unedited high-resolution photograph proving source facial features and clothing contrast.",
      isSimulated: true
    },
    {
      id: "ev-04",
      name: "evidence_telegram_channel_broadcast.png",
      size: 984500, // ~961 KB
      type: "image/png",
      platform: "Telegram",
      tag: "extortionTag",
      timestamp: "2026-10-20T14:10:35.000Z",
      hash: "93f0b835c24e937d581a8f934bd08726e6d1948b81349fc731b816a735c02914",
      description: "Screenshot of public Telegram broadcast channel posting preview thumbnails with extortion link.",
      isSimulated: true
    },
    {
      id: "ev-05",
      name: "perpetrator_profile_metadata_capture.png",
      size: 1120400, // ~1.07 MB
      type: "image/png",
      platform: "Instagram Profile",
      tag: "morphedTag",
      timestamp: "2026-10-21T09:05:18.000Z",
      hash: "772f4e82b79a0293847e92384a8bc947f123847291a0c7e849204857b293847c",
      description: "Account bio and profile header capture documenting permanent account link and impersonation text.",
      isSimulated: true
    }
  ],

  // Module 4: Chronological Timeline
  timelineEvents: [
    {
      id: "tl-01",
      date: "2026-10-18 19:42 IST",
      title: "First Extortion Contact Received via Instagram DM",
      description: "Account '@darkshadow_anon' sent initial direct message containing morphed image preview and demand for ₹25,000 within 48 hours.",
      evidenceHash: "8f4e2b17a6c9d034e8f19582bc0e318d45a9071f3b284e9c7042a981c62589fe"
    },
    {
      id: "tl-02",
      date: "2026-10-19 11:15 IST",
      title: "Perpetrator Launches Impersonation Profile",
      description: "Victim's friends alerted her that a new public profile '@priya_s_official_leak' was created using morphed profile banner and abusive captions.",
      evidenceHash: "4a71b2d039f68e591741ac6b392e59d9c8e147f2084c8a143527b10294e7583a"
    },
    {
      id: "tl-03",
      date: "2026-10-20 14:05 IST",
      title: "Escalation to Telegram Broadcast Channel",
      description: "Perpetrator shared a link to an anonymous Telegram channel threatening mass broadcast if payment was not received by midnight.",
      evidenceHash: "93f0b835c24e937d581a8f934bd08726e6d1948b81349fc731b816a735c02914"
    },
    {
      id: "tl-04",
      date: "2026-10-21 09:30 IST",
      title: "Zero-Knowledge Technical Evidence Vault Compilation",
      description: "Preserved original baseline comparison photograph, calculated SHA-256 hashes of all digital captures, and completed formal Section 65B Dossier.",
      evidenceHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  ]
};

# Design System Strategy: The Precision Archive

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves away from the cluttered, utility-first aesthetics of legacy administrative tools. Our Creative North Star is **The Digital Curator**. We treat employee data not as a series of database entries, but as a high-end editorial archive. 

By blending the structural logic of **Linear** with the airy, expansive feel of **Stripe**, we create a "workspace" rather than a "dashboard." The system breaks the traditional "box-in-a-box" template by utilizing intentional asymmetry, generous whitespace, and tonal layering. We prioritize the *breath* between data points, ensuring that even the most complex time-tracking table feels calm, authoritative, and premium.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a spectrum of sophisticated blues and neutrals, designed to reduce cognitive load during long periods of administrative use.

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders for sectioning are strictly prohibited.** Boundaries between the sidebar, header, and main content must be defined solely through background shifts. For example:
- **Main Background:** `surface` (#f7f9fb)
- **Sidebar:** `surface-container-low` (#f2f4f6)
- **Content Cards:** `surface-container-lowest` (#ffffff)

### Surface Hierarchy & Nesting
Depth is achieved through "Tonal Stacking." Instead of drawing lines, we layer sheets of color:
1.  **Base Layer:** `background` (#f7f9fb)
2.  **Sectional Layer:** `surface-container` (#eceef0) for secondary navigation or grouping.
3.  **Action Layer:** `surface-container-lowest` (#ffffff) for primary cards and data entry.

### The Glass & Gradient Rule
Floating elements (modals, popovers, or active dropdowns) should utilize **Glassmorphism**. Use a semi-transparent `surface` color with a `backdrop-blur` of 12px to 20px. 
- **Signature Texture:** Apply a subtle linear gradient to primary CTAs, transitioning from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle. This adds "soul" and depth, preventing the UI from feeling flat or "bootstrap-generic."

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance character with legibility.

*   **Display & Headlines (Manrope):** Used for "The Statement." High-contrast, tight tracking, and bold weights. This conveys the administrative authority of the system.
*   **Body & Labels (Inter):** Used for "The Utility." Inter is optimized for screen readability, specifically for dense time-logs and numerical data.

**Hierarchy Highlights:**
- **Display-LG (3.5rem):** Reserved for empty state heroes or major dashboard milestones.
- **Title-SM (1rem):** The workhorse for card headers and navigation labels.
- **Label-SM (0.6875rem):** Used for status badges and micro-copy, always set in `on_surface_variant` (#434655) with 0.05em letter spacing.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "muddy." In this system, we use light to define space.

*   **The Layering Principle:** Depth is achieved by placing a `surface-container-lowest` card on a `surface-container-low` background. The subtle 2% shift in brightness provides all the separation the human eye needs.
*   **Ambient Shadows:** When an element must float (e.g., a "Clock In" floating action button), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 74, 198, 0.06)`. Note the use of a blue tint rather than black to maintain vibrancy.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use the `outline_variant` (#c3c6d7) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Precision Primitives

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (0.75rem) corner radius. Use `on_primary` (#ffffff) for text.
- **Tertiary:** No background or border. Use `primary` (#004ac6) for text. On hover, apply a `surface-container-high` (#e6e8ea) background.

### Cards & Lists
**Strict Rule:** No divider lines between list items. Use the **Spacing Scale** `4` (0.9rem) to create clear vertical separation. Use alternating background tints (`surface-container-lowest` to `surface-container-low`) only if the data density exceeds 20 rows.

### Time-Tracking Inputs
- **State Focus:** When an input is active, do not just change the border color. Use a 2px outer glow (ring) of `primary_fixed` (#dbe1ff) to create a "soft focus" effect.
- **The "Pulse" Indicator:** For an active "Timer Running" state, use `tertiary` (#943700) with a slow opacity pulse animation to signify urgency without using "Error Red."

### Status Badges
Badges should use high-tonal contrast:
- **Success:** `surface_container_highest` background with `on_tertiary_fixed_variant` text. Avoid neon greens; keep them organic and muted.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetric Padding:** Give more "air" to the top of a page than the bottom to create a sense of upward momentum.
*   **Respect the Spacing Scale:** Every margin and padding must be a multiple of the provided scale (e.g., `2.5`, `5`, `10`).
*   **Use Subtle Micro-interactions:** Buttons should scale down slightly (0.98) on click to feel tactile.

### Don't:
*   **Don't use 100% black:** Even for text, use `on_surface` (#191c1e). It’s easier on the eyes and feels more premium.
*   **Don't use "Drop Shadows" on cards:** Use background color shifts. Reserve shadows only for elements that physically move *over* other content (modals/tooltips).
*   **Don't use icons as decoration:** Every icon must serve a functional purpose. If it doesn't clarify the action, remove it.

---

## 7. Spacing & Grid Logic
The system relies on a "Floating Grid." While the sidebar is fixed at `20` (4.5rem) or `24` (5.5rem), the main content container should have a `max-width` of 1440px with `auto` margins. This prevents the "stretched" look on ultra-wide monitors, maintaining the editorial integrity of the time-tracking tables.
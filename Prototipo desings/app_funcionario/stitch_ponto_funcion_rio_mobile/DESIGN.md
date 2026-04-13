# Design System Strategy: The Precision Architect

## 1. Overview & Creative North Star
The "Precision Architect" is the creative north star of this design system. It moves beyond the utilitarian nature of time tracking into a realm of **Executive Editorial**. While time tracking is often perceived as a chore, this system treats it as a high-value data narrative. 

We depart from the "standard corporate" look by embracing **Intentional Asymmetry** and **Tonal Depth**. Instead of rigid, boxed-in layouts, we use expansive white space and overlapping layers to create a sense of fluid movement. The goal is a UI that feels less like a spreadsheet and more like a premium, bespoke dashboard—think the clarity of Notion meets the technical sophistication of Stripe.

## 2. Color & Tonal Architecture
The palette is built on a foundation of high-contrast professional blues and neutral architectural grays.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** Within this system, 1px solid borders are prohibited for sectioning. Boundaries must be defined through:
- **Surface Shifts:** A `surface-container-low` section sitting on a `surface` background.
- **Tonal Transitions:** Using depth to signal the start of a new content block.

### Surface Hierarchy & Nesting
Treat the mobile screen as a physical stack of premium materials.
- **Level 0 (Base):** `surface` (#f7f9fb) – The canvas.
- **Level 1 (Sections):** `surface-container-low` (#f2f4f6) – For subtle grouping of content.
- **Level 2 (Active Elements):** `surface-container-lowest` (#ffffff) – Reserved for primary interactive cards.

### The "Glass & Gradient" Rule
To add "soul" to the corporate blue, we utilize **Signature Textures**. 
- **Hero CTAs:** Use a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135° angle.
- **Floating Navigation:** Apply Glassmorphism using `surface` at 80% opacity with a `24px` backdrop-blur. This ensures the UI feels integrated, not "pasted on."

## 3. Typography Scale
We utilize a single-typeface system (Inter) to maintain an editorial, streamlined feel. The sophistication comes from extreme weight contrast.

*   **Display (Display-LG to SM):** Bold, tight tracking (-2%). Used for high-impact data like "Total Hours This Week."
*   **Headlines (Headline-LG to SM):** Semi-bold. Used for page titles. These should often be left-aligned with generous top padding to create an "asymmetric" editorial header.
*   **Body (Body-LG to SM):** Regular weight. Optimized for readability. Use `on_surface_variant` (#434655) for secondary body text to reduce visual noise.
*   **Labels (Label-MD to SM):** All-caps with +5% letter spacing. Used for status badges and overlines to provide a technical, "Stripe-like" precision.

## 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` (White) card on a `surface-container-low` background. The slight shift in hex value provides a soft, natural lift that is easier on the eyes than a drop shadow.
*   **Ambient Shadows:** For floating action buttons or "active" cards, use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(0, 74, 198, 0.06);`. The shadow is tinted with the `primary` blue color to mimic natural light reflection.
*   **The "Ghost Border" Fallback:** If a container must be defined against a white background, use the `outline_variant` (#c3c6d7) at **15% opacity**. This creates a "breathable" boundary rather than a hard cage.

## 5. Signature Components

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Execution:** Use `24px` of vertical white space (Spacing Scale) to separate list items. For cards, use a `xl` (1.5rem) corner radius. 
*   **Interactive State:** Upon touch, a card should shift from `surface-container-lowest` to a very subtle `primary_fixed` (#dbe1ff) tint.

### Professional Inputs
*   **Style:** Minimalist underlining is too fragile; "boxed" is too heavy. Use a "Soft Inset" style.
*   **Visuals:** A `surface-container-high` (#e6e8ea) background with no border. On focus, the background stays neutral, but a `2px` left-accent bar of `primary` blue appears to indicate activity.

### Premium Navigation
*   **Floating Dock:** Instead of a standard bottom tab bar, use a floating dock with a `full` (9999px) corner radius, blurred background, and `label-sm` typography for icons.

### Status Badges (Chips)
*   **Design:** Use a "Low Chroma" approach. A `success` badge should have a background of `success` at 10% opacity, with the text at 100% opacity. This prevents the "vibrant" colors from distracting from the primary data.

### Chronometer (Custom Component)
*   **Design:** A large `display-lg` readout using tabular (monospaced) Inter numbers to prevent "jittering" as time increments.

## 6. Do’s and Don’ts

### Do:
*   **Do** use white space as a structural element. If a screen feels cluttered, increase the margin-bottom on your headlines before adding a line.
*   **Do** use `primary` sparingly. It should be a precision tool for action, not a decorative paint.
*   **Do** align elements to a 4px soft grid but allow "Display" elements to break the grid slightly for an editorial feel.

### Don’t:
*   **Don't** use 100% black (#000000). Always use `on_surface` (#191c1e) to maintain a premium, ink-on-paper look.
*   **Don't** use high-contrast borders. If the user can see the border before they see the content, the border is too dark.
*   **Don't** use standard "system" icons. Use thin-stroke (1.5px) elegant icons with rounded caps to match the `12px-16px` corner radius of the UI.
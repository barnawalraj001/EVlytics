# EVlytics — How the product works (feature workflows)

This document explains **what each area of the app does**, **how numbers are calculated**, and **how features connect**, so you can walk anyone through the experience without talking about code or frameworks.

**Suggested story for a demo:** start with **Profile** (your “baseline car”), run **Range prediction** once, skim **Dashboard** (everything lights up), open **Battery** for the health readout, **CO₂ Savings** for environmental impact, then **EV Assistant** for questions grounded in that same data.

---

## 1. Profile — the baseline for almost everything

**Where:** Dashboard → Profile  

**Purpose:** Capture *your* car and *your* driving economics. These values are the **reference** the app compares predictions and costs against.

**What you set**

| Area | What it means | Used for |
|------|-----------------|----------|
| User | Name, email, location | Greeting, assistant personalization |
| Vehicle model | Free text or preset | Display and assistant context |
| **Quick vehicle presets** (optional) | e.g. Tiago EV LR, Tigor EV, Citroën ë-C3 | One tap fills **battery size (kWh)** and **full range (km)**; you can still edit them |
| **Battery capacity (kWh)** | Pack size | Efficiency, cost-per-km, assistant |
| **Full range (km)** | Your rated / real-world full charge range | “Health” comparison, cost model, assistant |
| **Efficiency (km/kWh)** | Auto-calculated | Display; derived from range ÷ battery |
| Charging type | Fast / Normal | Profile record |
| **Cost per unit (₹/kWh)** | What you pay for electricity | Monthly EV cost estimate |
| **Average monthly distance (km)** | How far you drive per month | Monthly EV vs petrol card and assistant |

**Persistence:** Profile is **saved on this device** so returning users keep their baseline.

**Key idea:** **“Full range” in Profile** is treated as the car’s **rated or expected km when the battery is at 100%** under normal conditions. Predictions later are compared to this to estimate **battery health**.

---

## 2. Range prediction — remaining range today, plus “full range at 100%” under the same trip

**Where:** Dashboard → Range prediction  

**Purpose:** Answer: *“Given how I’m driving *right now* (charge, weather, speed, AC), how many km can I still do?”*

### 2.1 What you enter

- **State of charge (SOC)** — 1–100%  
- **Outside temperature (°C)**  
- **Average speed (km/h)**  
- **AC usage** — low / medium / high (mapped to a code the model expects)

### 2.2 What the model returns

The **prediction service** returns a single number: **`predicted_range_km`**.

That number is interpreted as **remaining range at the SOC you entered** — *not* automatically “full tank” range.

### 2.3 How we derive “full range at 100%” (same conditions)

To compare apples to apples with Profile’s **full range**, the app **normalizes** to 100% charge:

\[
\text{range at 100% SOC} = \frac{\text{predicted remaining km}}{(\text{SOC%} / 100)}
\]

**Example:** If SOC is 85% and predicted remaining is 200 km, then estimated full range under those same conditions is about \(200 / 0.85 \approx 235\) km.

This **normalized** figure is what feeds **battery health** and the assistant’s health estimate.

### 2.4 What gets saved

After a successful prediction, the app **stores**:

- The **predicted remaining km**  
- The **inputs** you used (SOC, temperature, speed, AC)  
- A **timestamp**

So the **Dashboard**, **Battery**, and **EV Assistant** can all use **your last run** without you re-entering it.

### 2.5 Charts and tips on this page

- **Range vs speed** chart is **illustrative** (demo curve), not your personal history.  
- **Tips** under the form are **general driving advice**, not tied to your numbers.

---

## 3. Dashboard (Overview) — where saved predictions meet profile and calculators

**Where:** Dashboard → Overview (home)

### 3.1 Metric cards (mostly “live”)

1. **Last predicted range**  
   - Shows the **remaining km** from your **last** Range prediction (if any).  
   - Subtitle can mention SOC and Profile full range for context.

2. **Battery health (estimate)**  
   - **Only if** you have a saved prediction **and** Profile full range &gt; 0.  
   - **Health %** ≈ *(normalized range at 100% SOC from prediction) ÷ (Profile full range) × 100*, capped in a sensible band.  
   - Meaning: *“Under last trip conditions, implied full range vs what the car is rated for in Profile.”*

3. **CO₂ saved this year**  
   - Comes from the **last saved run** on the **CO₂ Savings** page (tons per year).  
   - If you never ran the calculator, the card shows a placeholder until you do.

4. **Monthly comparison (EV vs petrol)**  
   - Uses **Profile only** (battery kWh, full range, ₹/kWh, average monthly km).  
   - See **section 4** for the exact cost logic.

### 3.2 Charts on the overview

- **Battery health trend** — **demo** time series (not your telematics).  
- **ICE vs EV emissions** — **demo** category chart for storytelling.

So: **cards lean on your data**; **some charts are illustrative**.

---

## 4. Monthly EV vs petrol cost — how the comparison works

**Where:** Shown on **Dashboard** (Monthly comparison card). **Inputs** come from **Profile**.

### 4.1 EV side

1. **Efficiency in Wh/km** (from pack and rated range):

   \[
   \text{Wh/km} = \frac{\text{battery kWh} \times 1000}{\text{full range (km)}}
   \]

2. **Cost per km (₹)** using your electricity rate:

   \[
   \text{₹/km}_\text{EV} = \frac{\text{Wh/km} \times \text{₹/kWh}}{1000}
   \]

3. **Monthly EV cost:**

   \[
   \text{monthly EV} = \text{average monthly km} \times \text{₹/km}_\text{EV}
   \]

### 4.2 Petrol side (default ICE baseline)

Defaults are **fixed for now** (typical Indian MVP assumptions):

- **Mileage:** 15 km/l  
- **Petrol price:** ₹100/l  

Then:

\[
\text{₹/km}_\text{petrol} = \frac{\text{₹/l}}{\text{km/l}}
\]

\[
\text{monthly petrol} = \text{average monthly km} \times \text{₹/km}_\text{petrol}
\]

### 4.3 Savings

\[
\text{savings} = \text{monthly petrol} - \text{monthly EV}
\]

**Caveat:** Petrol defaults are **not** user-editable in the UI yet; the assistant receives those defaults in context so it can explain them honestly.

---

## 5. Battery health page — deep view of the same health idea

**Where:** Dashboard → Battery  

**Purpose:** Show **estimated health**, **tier** (excellent → critical), **effective pack kWh**, and messaging — **when** a Range prediction exists.

### 5.1 When numbers appear

If there is **no** saved prediction (or Profile range is missing), the page explains that you need to **run Range prediction** and set **full range** in Profile.

### 5.2 When numbers are computed

Same core as Overview:

1. From saved prediction: **remaining km** + **SOC** → **range at 100% SOC** (normalization).  
2. **Health %** = that normalized range vs **Profile full range**.  
3. **Effective capacity (kWh)** ≈ rated kWh × (health% / 100).

### 5.3 What is illustrative

- **Multi-year degradation projection** chart is **demo / illustrative**, not a forecast trained on your car’s history.

---

## 6. CO₂ Savings — emissions avoided vs a petrol or diesel ICE

**Where:** Dashboard → CO₂ Savings  

**Purpose:** *“If I drove this many km per month in an ICE instead, how much extra CO₂ would that be?”*

### 6.1 Assumptions (fixed factors)

| Mode | g CO₂ per km (approx.) |
|------|-------------------------|
| Petrol ICE | 120 |
| Diesel ICE | 130 |
| EV (grid mix placeholder) | 20 |

These are **simplified** factors for education, not regulatory certification.

### 6.2 Calculations

For a chosen **monthly distance (km)** and **ICE type** (petrol or diesel):

1. **Monthly CO₂ saved (kg)**  
   \[
   \frac{(\text{ICE g/km} - \text{EV g/km}) \times \text{monthly km}}{1000}
   \]

2. **Yearly saved (tons)**  
   \[
   \frac{\text{monthly kg saved} \times 12}{1000}
   \]

3. **Tree equivalent**  
   - Uses an average **~21.7 kg CO₂ absorbed per tree per year** to turn yearly savings into “trees worth” of CO₂.

### 6.3 What gets saved

When you click **Calculate**, the app **stores** the last result (monthly kg, yearly tons, trees, ICE type, monthly km) **on this device**. That powers:

- The **Dashboard** “CO₂ saved this year” card  
- The **EV Assistant** snapshot  

### 6.4 Chart

- **Monthly emissions comparison** (ICE vs EV bars) uses **demo** category data for visualization, separate from your calculator inputs.

---

## 7. EV Assistant — answers grounded in your snapshot, not in fake trend files

**Where:** Dashboard → EV Assistant  

**Purpose:** Chat about **your** EV using the same numbers the app already has.

### 7.1 What happens on each message

1. The app builds an **“App store snapshot”**: a structured summary of **Profile**, **last Range prediction** (if any), **derived battery health %** (if possible), **monthly fuel comparison** (or null if inputs invalid), **petrol defaults**, and **last CO₂ Savings result** (or null).  
2. That snapshot is sent to the server with your **chat history**.  
3. The model is instructed to **only** use that snapshot as ground truth for *your* numbers.

### 7.2 What the assistant is **not** given

To reduce hallucinations, **static demo datasets** are **not** injected anymore — e.g. no fake **battery health over 12 months**, **range vs speed tables**, or **8-year degradation series** as if they were your car.

If a user asks for history you don’t have, the assistant should admit that and stick to **last prediction + profile**.

### 7.3 Chat history

Conversation is **saved on this device** (new chat clears that copy).  

**Note:** The assistant needs a valid **server API key** to run; without it, the UI shows an error message explaining configuration.

---

## 8. End-to-end workflow (cheat sheet)

| Step | User action | What updates |
|------|-------------|--------------|
| 1 | Fill **Profile** (especially full range, kWh, ₹/kWh, monthly km) | Baseline for health, costs, assistant |
| 2 | Run **Range prediction** | Remaining km + saved inputs; normalized 100% range |
| 3 | Open **Dashboard** | Range card, health card, monthly cost card; CO₂ card if Savings was run |
| 4 | Open **Battery** | Same health story with tiers and effective kWh |
| 5 | Run **CO₂ Savings** | Summary saved; Dashboard CO₂ card populated |
| 6 | Use **EV Assistant** | Each question carries fresh snapshot of the above |

---

## 9. Honest limitations (good to say in demos)

- **Health %** is an **estimate** from one prediction vs Profile — not a workshop diagnostic.  
- **CO₂ factors** and **petrol defaults** are **simplified**; real life varies by grid, driving style, and fuel price.  
- **Some charts** are **demos** for UI; rely on **cards and assistant snapshot** for “your” numbers.  
- Data is **device-local** unless you add a backend and accounts later.

---

*This file describes behavior as implemented in the dashboard routes: Profile, Range, Overview, Battery, CO₂ Savings, and EV Assistant.*

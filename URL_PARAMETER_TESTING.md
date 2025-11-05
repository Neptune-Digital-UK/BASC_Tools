# URL Parameter Auto-Evaluation Testing Guide

## Implementation Complete ✅

The eligibility evaluator now supports URL parameters with automatic evaluation. This document provides test URLs and expected behaviors.

## Test URLs

### Test 1: Valid Complete Data (Should Auto-Evaluate) ✅
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Thunder&age=8&sex=Gelding&breed=Thoroughbred&use=Dressage&sumInsured=75000&purchasePrice=65000
```

**Expected Behavior:**
- Form pre-fills with all data
- Evaluation triggers automatically within 100ms
- Loading modal displays
- Results show after AI evaluation completes
- No error messages

---

### Test 2: Valid Minimal Data (Required Fields Only) ✅
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Spirit&age=5&sex=Mare&breed=Quarter%20Horse&use=Trail%20Riding&sumInsured=25000
```

**Expected Behavior:**
- Form pre-fills with required fields only
- Purchase Price remains empty (optional field)
- Auto-evaluation triggers
- Results display successfully

---

### Test 3: Missing Required Field - No Horse Name ❌
```
http://localhost:3000/tools/eligibility-evaluator?age=10&sex=Stallion&breed=Arabian&use=Showing&sumInsured=50000
```

**Expected Behavior:**
- Form shows with partial data filled
- Amber warning banner appears at top
- Error message: "Horse Name is required"
- User must correct and manually submit
- No auto-evaluation

---

### Test 4: Missing Multiple Required Fields ❌
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Mystery&age=7
```

**Expected Behavior:**
- Amber warning banner with multiple errors:
  - "Sex is required"
  - "Breed is required"
  - "Use/Activity is required"
  - "Sum Insured is required"
- Form pre-fills horseName and age
- User must complete form manually

---

### Test 5: Invalid Age (Out of Range) ❌
```
http://localhost:3000/tools/eligibility-evaluator?horseName=OldTimer&age=45&sex=Gelding&breed=Mustang&use=Retired&sumInsured=15000
```

**Expected Behavior:**
- Warning banner shows: "Age must be a number between 0 and 40"
- Form shows with all fields filled
- User must correct age to 0-40 range

---

### Test 6: Invalid Sex Value ❌
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Buddy&age=6&sex=Unknown&breed=Paint&use=All%20Around&sumInsured=30000
```

**Expected Behavior:**
- Warning banner: "Invalid Sex value: 'Unknown'"
- Valid sex options: Colt, Stallion, Gelding, Filly, Mare
- User must select valid option

---

### Test 7: Invalid Breed Value ❌
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Star&age=4&sex=Filly&breed=NotABreed&use=Barrel%20Racing&sumInsured=20000
```

**Expected Behavior:**
- Warning banner: "Invalid Breed value: 'NotABreed'"
- User must select from available breed options

---

### Test 8: Invalid Use/Activity Value ❌
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Flash&age=9&sex=Gelding&breed=Appaloosa&use=InvalidActivity&sumInsured=40000
```

**Expected Behavior:**
- Warning banner: "Invalid Use/Activity value: 'InvalidActivity'"
- User must select valid activity option

---

### Test 9: Invalid Sum Insured (Non-Numeric) ❌
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Diamond&age=7&sex=Mare&breed=Warmblood&use=Jumper&sumInsured=abc123
```

**Expected Behavior:**
- Warning banner: "Sum Insured must be a valid number"
- User must enter valid numeric value

---

### Test 10: Currency Formatting (Various Formats) ✅
```
http://localhost:3000/tools/eligibility-evaluator?horseName=Gold&age=6&sex=Gelding&breed=Hanoverian&use=Dressage&sumInsured=100000&purchasePrice=95,000
```

**Expected Behavior:**
- Both currency fields auto-format with $ and commas
- sumInsured shows as: $100,000
- purchasePrice shows as: $95,000
- Auto-evaluation succeeds

---

### Test 11: No URL Parameters (Default State) ✅
```
http://localhost:3000/tools/eligibility-evaluator
```

**Expected Behavior:**
- Empty form displayed
- No warning banners
- No auto-evaluation
- Normal manual entry workflow

---

### Test 12: URL Encoded Spaces and Special Characters ✅
```
http://localhost:3000/tools/eligibility-evaluator?horseName=My%20Special%20Horse&age=3&sex=Colt&breed=Quarter%20Horse%2FPaint&use=Western%20Pleasure%20%28Competitively%29&sumInsured=35000
```

**Expected Behavior:**
- URL-encoded values properly decoded
- Horse Name: "My Special Horse"
- Breed: "Quarter Horse/Paint"
- Use: "Western Pleasure (Competitively)"
- Auto-evaluation succeeds

---

## Implementation Features

### ✅ Completed Features
1. **URL Parameter Parsing** - Reads all form fields from URL query parameters
2. **Automatic Validation** - Validates required fields and value constraints
3. **Auto-Trigger Evaluation** - Automatically submits when all data is valid
4. **Error Display** - Shows clear error messages for invalid/missing data
5. **Currency Formatting** - Automatically formats monetary values
6. **Form Pre-filling** - Populates form fields from URL parameters
7. **Manual Override** - Users can correct errors and manually submit

### Key Files Modified
- `src/app/tools/eligibility-evaluator/page.tsx`
  - Added `useSearchParams` hook
  - Added URL parsing logic
  - Added validation functions
  - Added auto-submission logic
  - Added error banner UI

### Helper Functions Added
1. `parseURLParams()` - Extracts and formats URL parameters
2. `validateURLFormData()` - Validates all form data constraints
3. Auto-submit useEffect - Triggers evaluation for valid data

## Valid Field Values

### Sex Options
- Colt, Stallion, Gelding, Filly, Mare

### Breed Options (Sample)
- Thoroughbred, Quarter Horse, Arabian, Warmblood, Paint, Appaloosa, Morgan, etc.
- See full list in component code

### Use/Activity Options (Sample)
- Dressage, Jumper, Hunter, Trail Riding, Barrel Racing, Cutting, Reining, etc.
- See full list in component code

### Age Range
- 0 to 40 years

### Sum Insured
- Any positive number
- Automatically formatted as currency with $ and commas

## Browser Testing Checklist

- [ ] Test valid complete data URL - should auto-evaluate
- [ ] Test valid minimal data URL - should auto-evaluate
- [ ] Test missing required fields - should show errors
- [ ] Test invalid age - should show error
- [ ] Test invalid sex value - should show error
- [ ] Test invalid breed value - should show error
- [ ] Test invalid use value - should show error
- [ ] Test invalid sum insured - should show error
- [ ] Test currency formatting - should format correctly
- [ ] Test no URL params - should show empty form
- [ ] Test URL encoded characters - should decode properly
- [ ] Test manual correction after error - should allow submission

## Notes

- **Auto-evaluation happens immediately** on page load if data is valid
- **Purchase Price is optional** and won't cause validation errors if missing
- **All other fields are required** for auto-evaluation
- **Currency values** can be passed with or without $ and commas
- **URL encoding** is recommended for special characters and spaces
- **Results page** displays normally after evaluation completes
- **"New" button** clears results and resets form for new entries


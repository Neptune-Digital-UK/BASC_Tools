# AI Eligibility Evaluator - User Guide

## Overview

The AI Eligibility Evaluator is an intelligent form that collects horse information and uses AI to provide instant, comprehensive eligibility evaluations for insurance coverage.

## How It Works

```
User Input → Format JSON → Chatbase AI API → Parse Response → Display Results
```

### Step-by-Step Flow:

1. **User fills out form** with horse details:
   - Horse Name
   - Age (years)
   - Sex (Gelding/Mare/Stallion)
   - Breed (dropdown with common breeds)
   - Use/Activity (dropdown with disciplines)
   - Purchase Price (optional)
   - Sum Insured (required)

2. **System formats data** into JSON structure:
```json
{
  "HorseActivity": "Pleasure",
  "HorseBirthyear": 2007,
  "HorseBreed": "Thoroughbred",
  "HorseID": "auto-generated-uuid",
  "HorseName": "Snowballs",
  "HorseNumber": 1,
  "HorseSex": "Gelding",
  "HorseSumInsured": 7500,
  "HorseValue": 7500
}
```

3. **Calls Chatbase AI API** with formatted data
   - API Endpoint: `https://www.chatbase.co/api/v1/chat`
   - Authorization: Bearer token authentication
   - Chatbot ID: `wVBzSogkMNl7a3jA_QwUu`

4. **AI evaluates** using the eligibility rules and returns structured JSON

5. **System parses** and displays results with:
   - Risk appetite status (ELIGIBLE/INELIGIBLE/UW_SUBMIT)
   - Value assessment
   - Eligible coverages
   - AI-powered recommendations
   - Next steps
   - Warnings

## Features

### 🎯 Smart Dropdowns
- **Breed**: Pre-populated with common breeds from eligibility rules
- **Use/Activity**: Contains all supported disciplines and uses
- **Sex**: Standard options (Gelding, Mare, Stallion)

### 🤖 AI-Powered Evaluation
- Real-time evaluation against complex eligibility rules
- Context-aware recommendations
- Considers value thresholds, age, breed, and use combinations

### 📊 Comprehensive Results Display
- Color-coded status indicators
- Visual coverage eligibility cards
- Detailed notes and explanations
- Priority-ranked recommendations

### 📋 Export Capabilities
- One-click copy formatted summary
- Ready for email or documentation
- Includes all key details

## API Configuration

The tool is configured to use your Chatbase API:

```javascript
const response = await fetch("https://www.chatbase.co/api/v1/chat", {
  method: "POST",
  headers: {
    Authorization: "Bearer 2ab89480-00e4-46cc-9e5c-051b28980905",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [{ content: JSON.stringify(horseData, null, 2), role: "user" }],
    chatbotId: "wVBzSogkMNl7a3jA_QwUu",
  }),
});
```

### Security Notes:
- API key is currently hardcoded (consider moving to environment variables for production)
- API calls are made client-side (consider moving to server-side API route for better security)

## Error Handling

The tool handles various error scenarios:

1. **Invalid Form Data**: Client-side validation prevents submission
2. **API Errors**: Displays user-friendly error messages
3. **Parse Errors**: Handles cases where AI returns non-JSON responses
4. **Network Errors**: Shows connectivity issues clearly

## Breed Options Available

- Thoroughbred
- Quarter Horse
- Warmblood
- Arabian
- Morgan
- Saddlebred
- Paint
- Appaloosa
- Standardbred
- Draft
- Pony
- Tennessee Walker
- Friesian
- Miniature Horse
- Paso Fino
- Other

## Use/Activity Options Available

**Sport Horse Activities:**
- Hunters, Jumpers, Dressage
- Eventing, Foxhunting
- Show Driving, Combined Driving
- Polo

**Western Activities:**
- Cutting, Reining
- Barrel Racing, Roping
- Steer Wrestling
- Ranch, Ranch Versatility

**General:**
- Pleasure, Trail Riding
- Breeding, Performance
- Racing

## Common Scenarios

### Scenario 1: Standard Pleasure Horse
**Input:**
- Name: Snowballs
- Age: 18 years
- Breed: Thoroughbred
- Use: Pleasure
- Value: $7,500

**Expected Result:**
- Status: ELIGIBLE
- Major Medical: Not available (under $20k threshold)
- Available: Medical Assistance, External Accident, Surgical, Colic

### Scenario 2: High-Value Dressage Horse
**Input:**
- Name: Royal Champion
- Age: 10 years
- Breed: Warmblood
- Use: Dressage
- Value: $125,000

**Expected Result:**
- Status: ELIGIBLE
- Major Medical: All types available
- Classic: Without coinsurance ($100k+)
- Additional: External Accident, Surgical

### Scenario 3: Barrel Racing Horse
**Input:**
- Name: Speed Demon
- Age: 8 years
- Breed: Quarter Horse
- Use: Barrel Racing
- Value: $35,000

**Expected Result:**
- Status: ELIGIBLE
- Major Medical: Basic only ($7,500 limit for Barrel)
- Available: External Accident, Surgical
- Note: Limited coverage for Barrel Racing

## Troubleshooting

### Issue: "API Error" message
**Solutions:**
- Check internet connectivity
- Verify API key is valid
- Check Chatbase service status

### Issue: "Failed to parse AI response"
**Cause:** AI returned text instead of JSON
**Solution:** This indicates the AI agent may need system message adjustment

### Issue: No results appear
**Check:**
- All required fields are filled
- Values are in valid format (numbers for age/value)
- Form validation passed

### Issue: Results seem incorrect
**Verify:**
- AI agent has correct system message (see ELIGIBILITY_AI_AGENT.md)
- Rules are up to date in the chatbot configuration
- Input data is correct

## Updating the AI Agent

If eligibility rules change, you need to:

1. Update the system message in your Chatbase chatbot
2. Reference: `ELIGIBILITY_AI_AGENT.md` for the complete system message
3. Test with known scenarios to verify correct behavior

## Integration with Other Tools

This tool works alongside:

1. **Eligibility Parser** - For pasting raw JSON responses
2. **Medical Coverage Eligibility Wizard** - For interactive rule exploration
3. **Equine Risk Selector** - For quick appetite checks

## Best Practices

1. **Always verify results** with underwriting for edge cases
2. **Use Copy Summary** to document evaluations
3. **Check warnings** carefully before proceeding
4. **Submit UW_SUBMIT cases** to underwriting for approval
5. **Keep form data accurate** for reliable results

## Future Enhancements

Potential improvements:
- [ ] Batch evaluation (multiple horses)
- [ ] Save evaluation history
- [ ] PDF export
- [ ] Email integration
- [ ] Custom notes field
- [ ] Comparison mode (compare multiple horses)

## Support

For issues or questions:
- Technical issues: Check browser console for errors
- Rule questions: Refer to `ELIGIBILITY_AI_AGENT.md`
- API issues: Contact Chatbase support

## Version History

- **v1.0** - Initial release
  - Form-based evaluation
  - Chatbase API integration
  - Real-time results display
  - Export capabilities


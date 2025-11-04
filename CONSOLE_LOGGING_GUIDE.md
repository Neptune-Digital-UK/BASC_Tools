# Console Logging Guide - AI Eligibility Evaluator

## Overview

The AI Eligibility Evaluator now includes comprehensive console logging to help you debug API requests and responses. All logs are organized in a collapsible group for easy viewing.

## How to View Console Logs

1. Open your browser's Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Safari**: Enable Developer menu in Preferences, then press `Cmd+Option+I`

2. Click on the **Console** tab

3. Fill out the form and click "Evaluate Eligibility"

4. Look for the grouped logs starting with "🤖 AI Eligibility Evaluation"

## Console Log Structure

### Example Output

```
🤖 AI Eligibility Evaluation
  📝 Form Data: {horseName: 'Snowballs', age: '18', breed: 'Thoroughbred', use: 'Pleasure', sex: 'Gelding', …}
  
  📦 Formatted Horse Data (to be sent to AI): 
  {
    "HorseActivity": "Pleasure",
    "HorseBirthyear": 2007,
    "HorseBreed": "Thoroughbred",
    "HorseID": "6502da54-fb9a-5846-8d9f-d2530d546ab2",
    "HorseName": "Snowballs",
    "HorseNumber": 1,
    "HorseSex": "Gelding",
    "HorseSumInsured": 7500,
    "HorseValue": 7500
  }
  
  📤 API Request Payload:
  {
    "messages": [
      {
        "content": "{\n  \"HorseActivity\": \"Pleasure\",\n  \"HorseBirthyear\": 2007,\n  ...\n}",
        "role": "user"
      }
    ],
    "chatbotId": "wVBzSogkMNl7a3jA_QwUu"
  }
  
  🌐 API Endpoint: https://www.chatbase.co/api/v1/chat
  🔑 Using Authorization: Bearer 2ab89480-****-****-****-************
  
  ⏱️  API Response Time: 1234.56ms
  📥 API Response Status: 200 OK
  📋 Response Headers: {content-type: 'application/json', ...}
  
  📥 Raw API Response Data:
  {
    "text": "{\n  \"evaluation_metadata\": {\n    \"horse_id\": \"...\",\n    ...\n  },\n  ...\n}",
    "conversationId": "...",
    ...
  }
  
  📄 AI Response Text (before cleaning): {...entire response...}
  📄 Cleaned Text (ready to parse): {...cleaned response...}
  
  ✅ Successfully Parsed Evaluation Result:
  {
    "evaluation_metadata": {
      "horse_id": "6502da54-fb9a-5846-8d9f-d2530d546ab2",
      "horse_name": "Snowballs",
      "evaluated_at": "2025-11-04T12:00:00Z",
      "age_years": 18
    },
    "risk_appetite": {
      "status": "ELIGIBLE",
      "category": "sport",
      "reason": "Thoroughbred used for Pleasure riding is eligible per Sport Horse appetite guidelines",
      "underwriting_notes": null
    },
    "coverage_eligibility": {...},
    ...
  }
  
  🎉 Evaluation Complete!
```

## Log Icons & Meanings

| Icon | Meaning | Description |
|------|---------|-------------|
| 🤖 | AI Process | Main group header for the evaluation process |
| 📝 | Form Data | Raw form input from the user |
| 📦 | Formatted Data | Horse data formatted for API |
| 📤 | Request | Outgoing API request payload |
| 🌐 | Endpoint | API URL being called |
| 🔑 | Auth | Authorization info (key is masked) |
| ⏱️ | Timing | API response time in milliseconds |
| 📥 | Response | Incoming API response |
| 📋 | Headers | HTTP response headers |
| 📄 | Text | AI response text content |
| 🧹 | Cleaning | Text cleaning operations |
| ✅ | Success | Successfully parsed result |
| 🎉 | Complete | Process finished successfully |
| ❌ | Error | Error occurred |

## What to Look For

### Successful Evaluation
1. **Form Data**: Verify all fields are captured correctly
2. **Formatted Data**: Check birth year calculation (current year - age)
3. **Request Payload**: Confirm proper JSON structure
4. **Response Time**: Should be 1-5 seconds typically
5. **Response Status**: Should be `200 OK`
6. **Parsed Result**: Should have all required fields

### Common Issues

#### Issue 1: API Error (Non-200 Status)
```
❌ API Error Response Body: {"error": "Invalid API key"}
❌ Submission Error: API Error: 401 Unauthorized
```
**Solution**: Check if API key is correct

#### Issue 2: Parse Error
```
📄 AI Response Text (before cleaning): "I'm sorry, I cannot help with that."
❌ Parse Error: SyntaxError: Unexpected token I in JSON at position 0
❌ Failed to parse text: I'm sorry, I cannot help with that.
```
**Solution**: The AI returned text instead of JSON. Check the chatbot's system message.

#### Issue 3: Missing Fields
```
❌ Unexpected response format - no 'text' field found
❌ Available fields: ["error", "message"]
```
**Solution**: API response structure is different than expected. Check API documentation.

#### Issue 4: Network Error
```
❌ Submission Error: Failed to fetch
```
**Solution**: Check internet connection or CORS settings

## Debugging Workflow

### Step 1: Check Form Data
```javascript
📝 Form Data: {...}
```
Verify all form fields are captured correctly before any processing.

### Step 2: Verify Formatted Data
```javascript
📦 Formatted Horse Data: {...}
```
Ensure:
- Birth year is calculated correctly (current year - age)
- All string fields are properly formatted
- Numeric values are parsed correctly
- UUID is generated

### Step 3: Inspect Request
```javascript
📤 API Request Payload: {...}
🌐 API Endpoint: ...
🔑 Using Authorization: ...
```
Confirm:
- Correct endpoint URL
- Proper JSON structure
- Authorization header is present

### Step 4: Check Response
```javascript
⏱️  API Response Time: ...ms
📥 API Response Status: 200 OK
📥 Raw API Response Data: {...}
```
Look for:
- Reasonable response time (< 10 seconds)
- 200 status code
- Valid JSON structure in response

### Step 5: Verify Parsing
```javascript
📄 AI Response Text (before cleaning): ...
📄 Cleaned Text (ready to parse): ...
✅ Successfully Parsed Evaluation Result: {...}
```
Check:
- Text contains valid JSON
- Markdown blocks are removed if present
- Parsing succeeds without errors
- Result has all expected fields

## Advanced Debugging

### Copy Logs for Support
1. Right-click on any log entry
2. Select "Store as global variable" or "Copy object"
3. Share with support team

### Export Full Console
1. Right-click in console area
2. Select "Save as..."
3. Save console log to file

### Filter Logs
- Type "AI Eligibility" in the console filter to show only these logs
- Use the console's filter icons to show/hide info, warnings, errors

## Performance Monitoring

### Response Time Benchmarks
- **< 2 seconds**: Excellent
- **2-5 seconds**: Good
- **5-10 seconds**: Acceptable (may be processing complex rules)
- **> 10 seconds**: Slow (investigate API or network issues)

### Example Performance Log
```
⏱️  API Response Time: 1847.32ms
```
This shows the API took about 1.8 seconds to respond.

## Privacy Note

The console logs contain:
- ✅ Full horse data (name, breed, value, etc.)
- ✅ API endpoint URL
- ⚠️ Partial API key (last digits masked)
- ✅ Full API responses

**Important**: Be careful when sharing console logs as they may contain sensitive business data. Always review and redact sensitive information before sharing.

## Production Considerations

### Disabling Logs in Production

If you want to disable console logs in production, wrap them in a development check:

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  console.group("🤖 AI Eligibility Evaluation");
  // ... all other logs
}
```

### Alternative: Use Debug Flag

Add a debug state:
```typescript
const [debug, setDebug] = useState(false);

if (debug) {
  console.log(...);
}
```

Then add a debug toggle button to enable/disable logging on demand.

## Troubleshooting Checklist

When an evaluation fails, check console logs for:

- [ ] Form data is complete and valid
- [ ] Birth year calculation is correct
- [ ] API endpoint URL is correct
- [ ] Authorization header is present
- [ ] API response status is 200
- [ ] Response contains 'text' field
- [ ] AI returned valid JSON (not plain text)
- [ ] All required fields are in the parsed result
- [ ] No JavaScript errors in console
- [ ] Network tab shows successful request

## Getting Help

If you encounter issues:

1. **Copy the entire console log group**
2. **Note the exact error message**
3. **Include the form data that caused the error**
4. **Share the API response time**
5. **Mention your browser and version**

This information will help quickly diagnose and resolve issues.


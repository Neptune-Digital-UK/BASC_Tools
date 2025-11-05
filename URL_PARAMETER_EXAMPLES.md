# URL Parameter Generation Examples

## Quick Reference

Generate shareable pre-filled evaluation links for the Eligibility Evaluator tool.

## Base URL

**Production:** `https://toolkit.basculeuw.com/tools/eligibility-evaluator`  
**Development:** `http://localhost:3000/tools/eligibility-evaluator`

## URL Parameters

| Parameter | Required | Type | Example Values |
|-----------|----------|------|----------------|
| `horseName` | ✅ Yes | string | `Thunder`, `My Horse` |
| `age` | ✅ Yes | number | `5`, `12`, `20` |
| `sex` | ✅ Yes | string | `Gelding`, `Mare`, `Stallion`, `Colt`, `Filly` |
| `breed` | ✅ Yes | string | `Thoroughbred`, `Quarter Horse`, `Warmblood` |
| `use` | ✅ Yes | string | `Dressage`, `Trail Riding`, `Jumper` |
| `sumInsured` | ✅ Yes | number | `50000`, `75000`, `125000` |
| `purchasePrice` | ❌ No | number | `45000`, `70000` |

## JavaScript Examples

### Example 1: Simple URL Builder Function

```javascript
function buildEligibilityURL(horseData) {
  const baseURL = 'https://toolkit.basculeuw.com/tools/eligibility-evaluator';
  const params = new URLSearchParams();
  
  // Required fields
  params.append('horseName', horseData.horseName);
  params.append('age', horseData.age);
  params.append('sex', horseData.sex);
  params.append('breed', horseData.breed);
  params.append('use', horseData.use);
  params.append('sumInsured', horseData.sumInsured);
  
  // Optional field
  if (horseData.purchasePrice) {
    params.append('purchasePrice', horseData.purchasePrice);
  }
  
  return `${baseURL}?${params.toString()}`;
}

// Usage
const url = buildEligibilityURL({
  horseName: 'Thunder',
  age: 8,
  sex: 'Gelding',
  breed: 'Thoroughbred',
  use: 'Dressage',
  sumInsured: 75000,
  purchasePrice: 65000
});

console.log(url);
// Output: https://toolkit.basculeuw.com/tools/eligibility-evaluator?horseName=Thunder&age=8&sex=Gelding&breed=Thoroughbred&use=Dressage&sumInsured=75000&purchasePrice=65000
```

### Example 2: Copy Link to Clipboard

```javascript
function copyEligibilityLink(horseData) {
  const url = buildEligibilityURL(horseData);
  
  navigator.clipboard.writeText(url)
    .then(() => {
      alert('Evaluation link copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy:', err);
    });
}

// Usage
copyEligibilityLink({
  horseName: 'Spirit',
  age: 5,
  sex: 'Mare',
  breed: 'Quarter Horse',
  use: 'Trail Riding',
  sumInsured: 25000
});
```

### Example 3: Email Link Generator

```javascript
function emailEligibilityLink(horseData, recipientEmail) {
  const url = buildEligibilityURL(horseData);
  const subject = `Horse Eligibility Evaluation - ${horseData.horseName}`;
  const body = `Hi,\n\nPlease review the eligibility evaluation for ${horseData.horseName}:\n\n${url}\n\nThis link will automatically evaluate the horse's insurance eligibility when opened.\n\nBest regards`;
  
  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.location.href = mailtoLink;
}

// Usage
emailEligibilityLink({
  horseName: 'Diamond',
  age: 7,
  sex: 'Mare',
  breed: 'Warmblood',
  use: 'Jumper',
  sumInsured: 100000
}, 'client@example.com');
```

### Example 4: React Component

```jsx
import React, { useState } from 'react';

function EligibilityLinkGenerator() {
  const [horseData, setHorseData] = useState({
    horseName: '',
    age: '',
    sex: '',
    breed: '',
    use: '',
    sumInsured: '',
    purchasePrice: ''
  });
  
  const [generatedURL, setGeneratedURL] = useState('');

  const generateURL = () => {
    const baseURL = 'https://toolkit.basculeuw.com/tools/eligibility-evaluator';
    const params = new URLSearchParams();
    
    Object.entries(horseData).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    const url = `${baseURL}?${params.toString()}`;
    setGeneratedURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedURL);
    alert('Link copied!');
  };

  return (
    <div>
      <h2>Generate Eligibility Evaluation Link</h2>
      
      <input
        type="text"
        placeholder="Horse Name"
        value={horseData.horseName}
        onChange={(e) => setHorseData({...horseData, horseName: e.target.value})}
      />
      
      {/* Add more inputs for other fields */}
      
      <button onClick={generateURL}>Generate Link</button>
      
      {generatedURL && (
        <div>
          <p>Generated URL:</p>
          <input type="text" value={generatedURL} readOnly />
          <button onClick={copyToClipboard}>Copy</button>
          <a href={generatedURL} target="_blank">Open in New Tab</a>
        </div>
      )}
    </div>
  );
}

export default EligibilityLinkGenerator;
```

### Example 5: Batch Processing from CSV

```javascript
function processHorsesFromCSV(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const urls = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const horseData = {};
    
    headers.forEach((header, index) => {
      horseData[header.trim()] = values[index]?.trim();
    });
    
    const url = buildEligibilityURL(horseData);
    urls.push({
      horse: horseData.horseName,
      url: url
    });
  }
  
  return urls;
}

// Example CSV:
// horseName,age,sex,breed,use,sumInsured
// Thunder,8,Gelding,Thoroughbred,Dressage,75000
// Spirit,5,Mare,Quarter Horse,Trail Riding,25000

const csvData = `horseName,age,sex,breed,use,sumInsured
Thunder,8,Gelding,Thoroughbred,Dressage,75000
Spirit,5,Mare,Quarter Horse,Trail Riding,25000`;

const evaluationLinks = processHorsesFromCSV(csvData);
console.log(evaluationLinks);
```

### Example 6: Generate QR Code for URL

```javascript
// Using a QR code library like 'qrcode'
import QRCode from 'qrcode';

async function generateEligibilityQR(horseData) {
  const url = buildEligibilityURL(horseData);
  
  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(url);
    
    // Display or download
    const img = document.createElement('img');
    img.src = qrCodeDataURL;
    document.body.appendChild(img);
    
    return qrCodeDataURL;
  } catch (err) {
    console.error('QR Code generation failed:', err);
  }
}

// Usage
generateEligibilityQR({
  horseName: 'Champion',
  age: 6,
  sex: 'Stallion',
  breed: 'Hanoverian',
  use: 'Dressage',
  sumInsured: 150000
});
```

## Python Examples

### Example 7: Python URL Builder

```python
from urllib.parse import urlencode

def build_eligibility_url(horse_data):
    base_url = 'https://toolkit.basculeuw.com/tools/eligibility-evaluator'
    
    # Filter out None values
    params = {k: v for k, v in horse_data.items() if v is not None}
    
    query_string = urlencode(params)
    return f"{base_url}?{query_string}"

# Usage
url = build_eligibility_url({
    'horseName': 'Thunder',
    'age': 8,
    'sex': 'Gelding',
    'breed': 'Thoroughbred',
    'use': 'Dressage',
    'sumInsured': 75000,
    'purchasePrice': 65000
})

print(url)
```

### Example 8: Python Batch Email Sender

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_eligibility_link(horse_data, recipient_email):
    url = build_eligibility_url(horse_data)
    
    msg = MIMEMultipart()
    msg['Subject'] = f"Horse Eligibility Evaluation - {horse_data['horseName']}"
    msg['From'] = 'your-email@example.com'
    msg['To'] = recipient_email
    
    body = f"""
Hi,

Please review the eligibility evaluation for {horse_data['horseName']}:

{url}

This link will automatically evaluate the horse's insurance eligibility when opened.

Best regards
"""
    
    msg.attach(MIMEText(body, 'plain'))
    
    # Send email (configure SMTP settings)
    # server = smtplib.SMTP('smtp.gmail.com', 587)
    # server.starttls()
    # server.login('your-email@example.com', 'password')
    # server.send_message(msg)
    # server.quit()
    
    return url

# Usage
send_eligibility_link({
    'horseName': 'Diamond',
    'age': 7,
    'sex': 'Mare',
    'breed': 'Warmblood',
    'use': 'Jumper',
    'sumInsured': 100000
}, 'client@example.com')
```

## Excel/Google Sheets Formula

### Example 9: Generate URLs in Spreadsheet

```excel
=CONCATENATE(
  "https://toolkit.basculeuw.com/tools/eligibility-evaluator?",
  "horseName=", A2,
  "&age=", B2,
  "&sex=", C2,
  "&breed=", D2,
  "&use=", E2,
  "&sumInsured=", F2,
  IF(G2<>"", "&purchasePrice=" & G2, "")
)
```

**Column Layout:**
- A: Horse Name
- B: Age
- C: Sex
- D: Breed
- E: Use
- F: Sum Insured
- G: Purchase Price (optional)

## Common Use Cases

### Use Case 1: Client Portal Integration
Generate evaluation links from your client management system and embed them in client portals or emails.

### Use Case 2: Insurance Agent Tool
Create a simple form for agents to fill out horse details and get shareable evaluation links instantly.

### Use Case 3: Batch Processing
Process multiple horses from a database or spreadsheet and generate evaluation links for each.

### Use Case 4: Mobile App Integration
Generate deep links that open the web tool with pre-filled data from a mobile app.

### Use Case 5: Automated Workflows
Trigger evaluations automatically as part of onboarding workflows or renewal processes.

## Tips & Best Practices

1. **URL Encoding**: Always encode special characters and spaces
2. **Validation**: Validate data before generating URLs to ensure auto-evaluation works
3. **Error Handling**: The tool will show validation errors for invalid data
4. **Bookmarking**: Generated URLs can be bookmarked or saved for later
5. **Analytics**: Consider adding UTM parameters for tracking (e.g., `&utm_source=email`)
6. **Security**: Don't include sensitive information in URLs beyond what's necessary

## Support

For questions or issues with URL parameter functionality, contact the development team or file an issue in the repository.


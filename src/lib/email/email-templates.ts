export interface JobApplicationEmailData extends Record<string, unknown> {
  applicantName: string;
  jobTitle: string;
  applicationDate: string;
  applicationId: string;
  companyName: string;
}

export interface GeneralApplicationEmailData extends Record<string, unknown> {
  applicantName: string;
  applicationDate: string;
  applicationId: string;
  companyName: string;
}

export const emailTemplates = {
  jobApplicationConfirmation: {
    subject: '🎉 Application Received - {{jobTitle}} at {{companyName}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
        <style>
          body {
            font-family: 'Google Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #ffffff;
            max-width: 700px;
            margin: 0 auto;
            padding: 0;
           <div class="container">
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">👤 Applicant:</span>
                <span class="detail-value">{{applicantName}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🎯 Application Type:</span>
                <span class="detail-value">General Career Interest</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📅 Submission Date:</span>
                <span class="detail-value">{{applicationDate}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🆔 Reference ID:</span>
                <span class="detail-value">#{{applicationId}}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h3>🚀 Your Next Steps</h3>
              <ul>
                <li>🔍 Our AI will analyze your profile for suitable opportunities</li>
                <li>🎯 Smart matching system will identify perfect role alignments</li>
                <li>📧 You'll receive updates when relevant positions become available</li>
                <li>🌟 Stay connected with our talent network for exclusive opportunities</li>
              </ul>
            </div>
          </div>und: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .email-container {
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            margin: 20px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            position: relative;
          }
          
          .geometric-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(79, 172, 254, 0.3) 0%, transparent 50%);
            opacity: 0.6;
          }
          
          .grid-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 30px 30px;
            opacity: 0.5;
          }
          
          .header {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 60px 40px 40px 40px;
            background: linear-gradient(135deg, 
              rgba(26, 35, 126, 0.9) 0%, 
              rgba(49, 27, 146, 0.9) 25%,
              rgba(91, 33, 182, 0.9) 50%,
              rgba(147, 51, 234, 0.9) 75%,
              rgba(79, 172, 254, 0.9) 100%);
          }
          
          .logo {
            font-size: 42px;
            font-weight: 900;
            background: linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335, #9C27B0, #00BCD4);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            animation: logoGlow 3s ease-in-out infinite alternate;
            letter-spacing: -1px;
          }
          
          @keyframes logoGlow {
            0% { 
              background-position: 0% 50%;
              filter: drop-shadow(0 0 20px rgba(66, 133, 244, 0.4));
            }
            100% { 
              background-position: 100% 50%;
              filter: drop-shadow(0 0 30px rgba(156, 39, 176, 0.6));
            }
          }
          
          .title { 
            font-size: 32px; 
            font-weight: 700; 
            color: #ffffff; 
            margin-bottom: 10px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
          
          .subtitle { 
            font-size: 18px; 
            color: rgba(255, 255, 255, 0.8);
            font-weight: 300;
          }
          
          .container {
            position: relative;
            z-index: 10;
            padding: 40px;
            background: rgba(26, 26, 26, 0.95);
            border-radius: 20px;
            margin: 30px;
            border: 1px solid rgba(79, 172, 254, 0.3);
            backdrop-filter: blur(10px);
          }
          
          .details { 
            margin-bottom: 30px; 
          }
          
          .detail-row {
            display: flex; 
            justify-content: space-between;
            padding: 15px 20px; 
            margin-bottom: 10px;
            background: rgba(79, 172, 254, 0.1);
            border-radius: 12px;
            border-left: 4px solid #4facfe;
            transition: all 0.3s ease;
          }
          
          .detail-row:hover {
            background: rgba(79, 172, 254, 0.2);
            transform: translateX(5px);
          }
          
          .detail-label { 
            color: rgba(255, 255, 255, 0.7); 
            font-size: 14px; 
            font-weight: 500;
          }
          
          .detail-value { 
            font-weight: 700; 
            color: #ffffff;
            font-size: 15px;
          }
          
          .next-steps {
            background: linear-gradient(135deg, 
              rgba(79, 172, 254, 0.15) 0%, 
              rgba(147, 51, 234, 0.15) 100%);
            border: 2px solid rgba(79, 172, 254, 0.3);
            border-radius: 16px;
            padding: 30px; 
            margin-top: 30px;
            position: relative;
            overflow: hidden;
          }
          
          .next-steps::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: shimmer 3s infinite;
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          .next-steps h3 { 
            color: #4facfe; 
            font-size: 22px; 
            margin-bottom: 15px; 
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .next-steps li { 
            margin-bottom: 12px; 
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 500;
          }
          
          .footer {
            position: relative;
            z-index: 10;
            text-align: center; 
            padding: 40px 30px;
            background: linear-gradient(135deg, 
              rgba(0, 0, 0, 0.95) 0%, 
              rgba(26, 26, 26, 0.95) 50%, 
              rgba(79, 172, 254, 0.1) 100%);
            border-top: 3px solid rgba(79, 172, 254, 0.6);
          }
          
          .footer-content {
            margin-bottom: 20px;
          }
          
          .footer-main {
            font-size: 16px; 
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .footer-tagline {
            font-size: 14px;
            color: rgba(79, 172, 254, 0.8);
            margin-bottom: 15px;
            font-style: italic;
            font-weight: 300;
          }
          
          .footer-credits {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 15px;
            font-weight: 400;
          }
          
          .heart {
            color: #ff6b6b;
            font-size: 14px;
            animation: heartbeat 2s ease-in-out infinite;
            filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.5));
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          .io-badge {
            display: inline-block;
            background: linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 10px;
            box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="geometric-bg"></div>
          <div class="grid-pattern"></div>
          
          <div class="header">
            <div class="logo">Onekbyte Labs</div>
            <div class="title">Application Received 🚀</div>
            <div class="subtitle">Welcome to the future of AI-powered recruitment</div>
            <div class="io-badge">I/O Inspired Design</div>
          </div>
          
          <div class="container">
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">👤 Applicant:</span>
                <span class="detail-value">{{applicantName}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">💼 Position:</span>
                <span class="detail-value">{{jobTitle}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📅 Date:</span>
                <span class="detail-value">{{applicationDate}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🆔 Application ID:</span>
                <span class="detail-value">#{{applicationId}}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h3>🎯 What Happens Next</h3>
              <ul>
                <li>🤖 Advanced AI will analyze your application within 24-48 hours</li>
                <li>📊 Intelligent matching algorithm will assess your fit</li>
                <li>📞 If selected, our team will contact you for next steps</li>
                <li>⚡ Expect a comprehensive response within one week</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="footer-main">© 2025 Onekbyte Labs — Next-Generation Recruitment Platform</div>
              <div class="footer-tagline">Powered by artificial intelligence • Inspired by Google I/O design</div>
              <div class="footer-credits">Crafted with <span class="heart">❤️</span> by Aniket</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
🎉 Application Received at Onekbyte Labs

👤 Applicant: {{applicantName}}
💼 Position: {{jobTitle}}
📅 Date: {{applicationDate}}
🆔 ID: #{{applicationId}}

🚀 Next Steps:
- AI system will analyze your application in 24-48h
- If shortlisted, our team will contact you
- Expect a response within 1 week
© 2025 Onekbyte Labs — Powered by AI recruitment
    `
  },

  generalApplicationConfirmation: {
    subject: '✨ Application Received - Career Opportunities at {{companyName}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Google Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #ffffff;
            max-width: 700px;
            margin: 0 auto;
            padding: 0;
            background: linear-gradient(135deg, #34A853 0%, #06d6a0 25%, #00bcd4 50%, #4facfe 75%, #667eea 100%);
            background-size: 400% 400%;
            animation: gradientShift 10s ease infinite;
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .email-container {
            background: rgba(0, 20, 15, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            margin: 20px;
            border: 2px solid rgba(52, 168, 83, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            position: relative;
          }
          
          .geometric-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(52, 168, 83, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(6, 214, 160, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.3) 0%, transparent 50%);
            opacity: 0.7;
          }
          
          .grid-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(rgba(52, 168, 83, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52, 168, 83, 0.1) 1px, transparent 1px);
            background-size: 25px 25px;
            opacity: 0.6;
          }
          
          .header {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 60px 40px 40px 40px;
            background: linear-gradient(135deg, 
              rgba(20, 83, 45, 0.9) 0%, 
              rgba(52, 168, 83, 0.9) 25%,
              rgba(6, 214, 160, 0.9) 50%,
              rgba(0, 188, 212, 0.9) 75%,
              rgba(102, 126, 234, 0.9) 100%);
          }
          
          .logo {
            font-size: 42px;
            font-weight: 900;
            background: linear-gradient(45deg, #34A853, #06d6a0, #00bcd4, #4facfe, #34A853);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            animation: logoGlow 4s ease-in-out infinite alternate;
            letter-spacing: -1px;
          }
          
          @keyframes logoGlow {
            0% { 
              background-position: 0% 50%;
              filter: drop-shadow(0 0 20px rgba(52, 168, 83, 0.4));
            }
            100% { 
              background-position: 100% 50%;
              filter: drop-shadow(0 0 30px rgba(6, 214, 160, 0.6));
            }
          }
          
          .title { 
            font-size: 32px; 
            font-weight: 700; 
            color: #ffffff; 
            margin-bottom: 10px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
          
          .subtitle { 
            font-size: 18px; 
            color: rgba(255, 255, 255, 0.8);
            font-weight: 300;
          }
          
          .container {
            position: relative;
            z-index: 10;
            padding: 40px;
            background: rgba(20, 35, 26, 0.95);
            border-radius: 20px;
            margin: 30px;
            border: 1px solid rgba(52, 168, 83, 0.3);
            backdrop-filter: blur(10px);
          }
          
          .details { 
            margin-bottom: 30px; 
          }
          
          .detail-row {
            display: flex; 
            justify-content: space-between;
            padding: 15px 20px; 
            margin-bottom: 10px;
            background: rgba(52, 168, 83, 0.15);
            border-radius: 12px;
            border-left: 4px solid #34A853;
            transition: all 0.3s ease;
          }
          
          .detail-row:hover {
            background: rgba(52, 168, 83, 0.25);
            transform: translateX(5px);
          }
          
          .detail-label { 
            color: rgba(255, 255, 255, 0.7); 
            font-size: 14px; 
            font-weight: 500;
          }
          
          .detail-value { 
            font-weight: 700; 
            color: #ffffff;
            font-size: 15px;
          }
          
          .next-steps {
            background: linear-gradient(135deg, 
              rgba(52, 168, 83, 0.15) 0%, 
              rgba(6, 214, 160, 0.15) 100%);
            border: 2px solid rgba(52, 168, 83, 0.3);
            border-radius: 16px;
            padding: 30px; 
            margin-top: 30px;
            position: relative;
            overflow: hidden;
          }
          
          .next-steps::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(52, 168, 83, 0.2), transparent);
            animation: shimmer 4s infinite;
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          .next-steps h3 { 
            color: #34A853; 
            font-size: 22px; 
            margin-bottom: 15px; 
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .next-steps li { 
            margin-bottom: 12px; 
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 500;
          }
          
          .footer {
            position: relative;
            z-index: 10;
            text-align: center; 
            padding: 40px 30px;
            background: linear-gradient(135deg, 
              rgba(0, 0, 0, 0.95) 0%, 
              rgba(20, 35, 26, 0.95) 50%, 
              rgba(52, 168, 83, 0.1) 100%);
            border-top: 3px solid rgba(52, 168, 83, 0.6);
          }
          
          .footer-content {
            margin-bottom: 20px;
          }
          
          .footer-main {
            font-size: 16px; 
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .footer-tagline {
            font-size: 14px;
            color: rgba(52, 168, 83, 0.8);
            margin-bottom: 15px;
            font-style: italic;
            font-weight: 300;
          }
          
          .footer-credits {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 15px;
            font-weight: 400;
          }
          
          .heart {
            color: #ff6b6b;
            font-size: 14px;
            animation: heartbeat 2s ease-in-out infinite;
            filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.5));
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          .io-badge {
            display: inline-block;
            background: linear-gradient(45deg, #34A853, #06d6a0, #00bcd4);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 10px;
            box-shadow: 0 4px 15px rgba(52, 168, 83, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="geometric-bg"></div>
          <div class="grid-pattern"></div>
          
          <div class="header">
            <div class="logo">Onekbyte Labs</div>
            <div class="title">Career Interest Received 🌟</div>
            <div class="subtitle">Your journey with innovative technology starts here</div>
            <div class="io-badge">Future Ready</div>
          </div>
        <div class="container">
          <div class="details">
            <div class="detail-row"><span class="detail-label">👤 Applicant:</span><span class="detail-value">{{applicantName}}</span></div>
            <div class="detail-row"><span class="detail-label">🎯 Type:</span><span class="detail-value">General Career Interest</span></div>
            <div class="detail-row"><span class="detail-label">📅 Date:</span><span class="detail-value">{{applicationDate}}</span></div>
            <div class="detail-row"><span class="detail-label">🆔 ID:</span><span class="detail-value">#{{applicationId}}</span></div>
          </div>
          <div class="next-steps">
            <h3>Next Steps</h3>
            <ul>
              <li>🔍 We’ll review your profile for opportunities</li>
              <li>🎯 Matching skills with open positions</li>
              <li>📧 Updates when relevant positions open</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <div class="footer-content">
            <div class="footer-main">© 2025 Onekbyte Labs — Future-Ready Career Solutions</div>
            <div class="footer-tagline">Connecting exceptional talent with innovative opportunities • I/O Inspired</div>
            <div class="footer-credits">Crafted with <span class="heart">❤️</span> by Aniket</div>
          </div>
        </div>
      </div>
      </body>
      </html>
    `,
    textContent: `
✨ Application Received at Onekbyte Labs

👤 Applicant: {{applicantName}}
🎯 Type: General Career Interest
📅 Date: {{applicationDate}}
🆔 ID: #{{applicationId}}

🚀 Next Steps:
- We'll review your profile for opportunities
- Matching skills with open positions
- Updates when relevant positions open

© 2025 Onekbyte Labs — Future-ready careers
    `
  },

  adminNotification: {
    subject: '🚨 New Application Alert - {{jobTitle || "General Application"}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Google Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #ffffff;
            max-width: 700px;
            margin: 0 auto;
            padding: 0;
            background: linear-gradient(135deg, #f97316 0%, #dc2626 25%, #ec4899 50%, #8b5cf6 75%, #3b82f6 100%);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .email-container {
            background: rgba(20, 5, 0, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            margin: 20px;
            border: 2px solid rgba(249, 115, 22, 0.3);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            overflow: hidden;
            position: relative;
          }
          
          .geometric-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%);
            opacity: 0.7;
          }
          
          .grid-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
            background-size: 25px 25px;
            opacity: 0.6;
          }
          
          .header {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 60px 40px 40px 40px;
            background: linear-gradient(135deg, 
              rgba(124, 45, 18, 0.9) 0%, 
              rgba(249, 115, 22, 0.9) 25%,
              rgba(220, 38, 38, 0.9) 50%,
              rgba(236, 72, 153, 0.9) 75%,
              rgba(139, 92, 246, 0.9) 100%);
          }
          
          .logo {
            font-size: 42px;
            font-weight: 900;
            background: linear-gradient(45deg, #f97316, #dc2626, #ec4899, #8b5cf6, #f97316);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            animation: logoGlow 4s ease-in-out infinite alternate;
            letter-spacing: -1px;
          }
          
          @keyframes logoGlow {
            0% { 
              background-position: 0% 50%;
              filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.4));
            }
            100% { 
              background-position: 100% 50%;
              filter: drop-shadow(0 0 30px rgba(220, 38, 38, 0.6));
            }
          }
          
          .title { 
            font-size: 32px; 
            font-weight: 700; 
            color: #ffffff; 
            margin-bottom: 10px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
          
          .subtitle { 
            font-size: 18px; 
            color: rgba(255, 255, 255, 0.8);
            font-weight: 300;
          }
          
          .container {
            position: relative;
            z-index: 10;
            padding: 40px;
            background: rgba(35, 20, 20, 0.95);
            border-radius: 20px;
            margin: 30px;
            border: 1px solid rgba(249, 115, 22, 0.3);
            backdrop-filter: blur(10px);
          }
          
          .detail-row {
            display: flex; 
            justify-content: space-between;
            padding: 15px 20px; 
            margin-bottom: 10px;
            background: rgba(249, 115, 22, 0.15);
            border-radius: 12px;
            border-left: 4px solid #f97316;
            transition: all 0.3s ease;
          }
          
          .detail-row:hover {
            background: rgba(249, 115, 22, 0.25);
            transform: translateX(5px);
          }
          
          .detail-label { 
            color: rgba(255, 255, 255, 0.7); 
            font-size: 14px; 
            font-weight: 500;
          }
          
          .detail-value { 
            font-weight: 700; 
            color: #ffffff;
            font-size: 15px;
          }
          
          .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316, #dc2626);
            color: white;
            padding: 15px 30px;
            border-radius: 12px;
            font-weight: 700;
            text-decoration: none;
            margin-top: 25px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .action-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: shimmer 3s infinite;
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          .footer {
            position: relative;
            z-index: 10;
            text-align: center; 
            padding: 40px 30px;
            background: linear-gradient(135deg, 
              rgba(0, 0, 0, 0.95) 0%, 
              rgba(35, 20, 20, 0.95) 50%, 
              rgba(249, 115, 22, 0.1) 100%);
            border-top: 3px solid rgba(249, 115, 22, 0.6);
          }
          
          .footer-content {
            margin-bottom: 20px;
          }
          
          .footer-main {
            font-size: 16px; 
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .footer-tagline {
            font-size: 14px;
            color: rgba(249, 115, 22, 0.8);
            margin-bottom: 15px;
            font-style: italic;
            font-weight: 300;
          }
          
          .footer-credits {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 15px;
            font-weight: 400;
          }
          
          .heart {
            color: #ff6b6b;
            font-size: 14px;
            animation: heartbeat 2s ease-in-out infinite;
            filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.5));
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          .alert-badge {
            display: inline-block;
            background: linear-gradient(45deg, #f97316, #dc2626, #ec4899);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 10px;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
          }
        </style>
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="geometric-bg"></div>
          <div class="grid-pattern"></div>
          
          <div class="header">
            <div class="logo">Onekbyte Labs</div>
            <div class="title">🚨 New Application Alert</div>
            <div class="subtitle">Immediate attention required</div>
            <div class="alert-badge">Urgent Review</div>
          </div>
          
          <div class="container">
            <div class="detail-row">
              <span class="detail-label">👤 Applicant:</span>
              <span class="detail-value">{{applicantName}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💼 Position:</span>
              <span class="detail-value">{{jobTitle || "General Application"}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Date:</span>
              <span class="detail-value">{{applicationDate}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🆔 ID:</span>
              <span class="detail-value">#{{applicationId}}</span>
            </div>
            {{#if applicantEmail}}
            <div class="detail-row">
              <span class="detail-label">📧 Email:</span>
              <span class="detail-value">{{applicantEmail}}</span>
            </div>
            {{/if}}
            {{#if applicantPhone}}
            <div class="detail-row">
              <span class="detail-label">📱 Phone:</span>
              <span class="detail-value">{{applicantPhone}}</span>
            </div>
            {{/if}}
            <div style="text-align:center; margin-top: 30px;">
              <a href="{{adminDashboardUrl}}" class="action-button">🔍 Review Application</a>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="footer-main">© 2025 Onekbyte Labs — Automated HR Intelligence</div>
              <div class="footer-tagline">Smart notifications for smarter recruitment decisions • I/O Inspired</div>
              <div class="footer-credits">Crafted with <span class="heart">❤️</span> by Aniket</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
🚨 New Application Alert — Onekbyte Labs

👤 Applicant: {{applicantName}}
💼 Position: {{jobTitle || "General Application"}}
📅 Date: {{applicationDate}}
🆔 ID: #{{applicationId}}
{{#if applicantEmail}}📧 Email: {{applicantEmail}}{{/if}}
{{#if applicantPhone}}📱 Phone: {{applicantPhone}}{{/if}}

🔍 Review this application now:
{{adminDashboardUrl}}

© 2025 Onekbyte Labs — Automated HR Notification
MADE WITH ❤️ BY ANIKET
    ` 
  }
}  

import os

HTML_OUTPUT = 'C:/Users/samue/OneDrive/Documents/projects/AIBoyz/EmailSequence/index.html'

def get_email_content(week_num):
    contents = {
        1: """
            <h2 style="margin: 0 0 20px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; color: #0f172a; font-weight: 800;">Hi [First Name],</h2>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">Right now, your teachers are exhausted. They dread new initiatives.</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
              <tr>
                <td style="padding: 15px 20px; background-color: #f8fafc; border-left: 4px solid #F7B500;">
                  <p style="margin: 0; font-style: italic; font-size: 15px; color: #475569; line-height: 1.6;">"You are pressured to improve SEL metrics across [City/District]. But adding more work to their plates is not the answer."</p>
                </td>
              </tr>
            </table>

            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">What if you had a turnkey system? One where students volunteer to become community leaders. <strong>Without adding one minute of teacher prep.</strong></p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
                <tr>
                    <td align="center" style="background-color: #0f172a; padding: 16px 20px;">
                        <p style="margin: 0; font-family: 'Outfit', 'Inter', Helvetica, Arial, sans-serif; font-size: 18px; color: #ffffff; letter-spacing: 1px; font-weight: 700;">INTRODUCING: COGNITIVE TRUST</p>
                    </td>
                </tr>
            </table>
            
            <p style="margin: 0 0 24px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">It uses character-driven narratives to build deep empathy. Instantly.</p>
            
            <p style="margin: 0 0 30px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; line-height: 1.6; font-weight: 800; text-align: center;">Can I send you a free, zero-prep activity sheet for [School Name]?</p>
        """,
        2: """
            <h2 style="margin: 0 0 20px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; color: #0f172a; font-weight: 800;">Hi [First Name],</h2>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">If you tell a middle schooler a fact, they forget it instantly.</p>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">Data does not change behavior. But stories do. Imagine your students reading about <strong>Demeter</strong>, a hero defending her town.</p>

            <!-- FAUX VIDEO PLAYER (BULLETPROOF) -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
              <tr>
                <td align="center" style="background-color: #0f172a; padding: 40px 20px;">
                  <a href="https://hungeractionheroes.org" style="text-decoration: none;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tr>
                            <td align="center" valign="middle" style="background-color: #F7B500; width: 60px; height: 60px; border: 2px solid #ffffff; border-radius: 30px;">
                                <p style="margin:0; font-size: 24px; color: #0f172a; line-height: 60px; margin-left: 4px;">▶</p>
                            </td>
                        </tr>
                    </table>
                    <p style="margin: 15px 0 0 0; color: #ffffff; font-family: 'Inter', Helvetica, Arial, sans-serif; font-weight: bold; font-size: 14px; letter-spacing: 1px;">WATCH THE AUDIOBOOK IN ACTION</p>
                  </a>
                </td>
              </tr>
            </table>
            
            <p style="margin: 0 0 24px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">It transforms school culture. It boosts [School Name]'s social impact metrics. Completely effortlessly.</p>
            
            <p style="margin: 0 0 30px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; line-height: 1.6; font-weight: 800; text-align: center;">Are your teachers ready for an easy win?</p>
        """,
        3: """
            <h2 style="margin: 0 0 20px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; color: #0f172a; font-weight: 800;">Hi [First Name],</h2>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">What happens when you combine student empathy with healthy school pride?</p>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">Gamifying community service skyrockets student participation. That is why we are launching a massive <strong>Interactive Leaderboard</strong> where schools compete to rescue food for their communities.</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
                <tr>
                    <td align="center" style="border: 2px dashed #0f172a; padding: 20px;">
                        <p style="margin: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; line-height: 1.6; font-weight: 600;">Students track real-world hunger-relief activities and watch their school climb the regional rankings. It is a huge win for district recognition.</p>
                    </td>
                </tr>
            </table>
            
            <p style="margin: 0 0 24px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">We're opening up early enrollment for schools that want to boost student engagement before the leaderboard goes fully public.</p>
            
            <p style="margin: 0 0 30px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; line-height: 1.6; font-weight: 800; text-align: center;">Would you be open to a quick 10-minute chat next week to see if this fits?</p>
        """,
        4: """
            <h2 style="margin: 0 0 20px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; color: #0f172a; font-weight: 800;">Hi [First Name],</h2>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">To get [School Name] officially on the upcoming Leaderboard, you need the right tools.</p>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">We've officially launched the <strong>Curriculum Bundle</strong>. This is the exact turnkey system that helps schools rescue food while teaching core SEL values—with zero heavy lifting.</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
              <tr>
                <td style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #F7B500;">
                  <p style="margin: 0 0 12px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; font-weight: 800;">The bundle includes:</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr><td style="padding: 0 0 8px 10px; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 15px; color: #334155;">&bull; 40 physical comic books for the classroom</td></tr>
                    <tr><td style="padding: 0 0 8px 10px; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 15px; color: #334155;">&bull; The comprehensive teacher's guide (100% zero-prep)</td></tr>
                    <tr><td style="padding: 0 0 8px 10px; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 15px; color: #334155;">&bull; Digital animated audiobooks and video messages</td></tr>
                    <tr><td style="padding: 0 0 0 10px; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 15px; color: #334155;">&bull; Official access to the Interactive Leaderboard</td></tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <p style="margin: 0 0 30px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; line-height: 1.6; font-weight: 800; text-align: center;">Purchasing the bundle today automatically secures your school's slot.</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
              <tr>
                <td align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td align="center" style="background-color: #F7B500; padding: 14px 24px;">
                            <a href="https://hungeractionheroes.org" style="color: #0f172a; text-decoration: none; font-weight: 800; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; text-transform: uppercase;">SECURE YOUR BUNDLE</a>
                        </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <br>
        """,
        5: """
            <h2 style="margin: 0 0 20px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; color: #0f172a; font-weight: 800;">Hi [First Name],</h2>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">We are currently finalizing the allocation of our <strong>Classroom Kits</strong> for the upcoming semester.</p>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">Remember, when you purchase the curriculum bundle, <strong>every dollar directly provides two meals and prevents two pounds of food waste.</strong> You get a world-class SEL curriculum that runs itself.</p>
            

            
            <p style="margin: 0 0 30px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; line-height: 1.6; font-weight: 800; text-align: center;">Click below to secure your district's prestige and officially enroll [School Name].</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
              <tr>
                <td align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td align="center" style="background-color: #F7B500; padding: 14px 24px;">
                            <a href="https://hungeractionheroes.org" style="color: #0f172a; text-decoration: none; font-weight: 800; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; text-transform: uppercase;">ENROLL [SCHOOL NAME] NOW</a>
                        </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <br>
        """,
        6: """
            <h2 style="margin: 0 0 20px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 24px; color: #0f172a; font-weight: 800;">Hi [First Name],</h2>
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">I haven't heard back yet. I will assume effortless student engagement isn't a top priority for [School Name] right now.</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
                <tr>
                    <td style="background-color: #f1f5f9; border-left: 4px solid #0f172a; padding: 16px 20px;">
                        <p style="margin: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #0f172a; line-height: 1.6; font-weight: 600;">Since our Interactive Leaderboard launches next week, we will give your slot to another district.</p>
                    </td>
                </tr>
            </table>
            
            <p style="margin: 0 0 16px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">I respect your decision. I will not reach out again.</p>
            
            <p style="margin: 0 0 30px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">If priorities shift, you can always grab a bundle directly below.</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
              <tr>
                <td align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td align="center" style="background-color: #F7B500; padding: 14px 24px;">
                            <a href="https://hungeractionheroes.org" style="color: #0f172a; text-decoration: none; font-weight: 800; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; text-transform: uppercase;">FINAL CHANCE: SECURE BUNDLE</a>
                        </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <br>
        """
    }
    return contents[week_num]

def build_full_html():
    subjects = [
        "The hidden crisis at [School Name]",
        "Why facts fail at [School Name]",
        "Gamifying Impact at [School Name]",
        "The exact tools to secure your spot",
        "Allocation for your district",
        "Giving your slot to another district"
    ]

    html_parts = []
    html_parts.append('''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HAHU Agency Pitch - Email Sequence</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Outfit:wght@700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --brand-yellow: #F7B500;
            --brand-slate: #0f172a;
            --brand-white: #ffffff;
            --brand-bg: #f8fafc;
            --brand-gray: #e2e8f0;
            --brand-text: #334155;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: var(--brand-bg);
            color: var(--brand-text);
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        @media (min-width: 900px) {
            body { flex-direction: row; }
            .sidebar {
                width: 320px;
                height: 100vh;
                position: fixed;
                overflow-y: auto;
                background-color: var(--brand-slate);
                color: var(--brand-white);
            }
            .main-content {
                margin-left: 320px;
                width: calc(100% - 320px);
                min-height: 100vh;
            }
        }

        .sidebar {
            padding: 40px 30px;
            box-sizing: border-box;
            background-color: var(--brand-slate);
            color: var(--brand-white);
        }

        .logo-container { margin-bottom: 40px; }
        .sidebar h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            letter-spacing: -0.5px;
            margin: 0;
            color: var(--brand-white);
        }
        .sidebar p.subtitle {
            font-weight: 600;
            font-size: 13px;
            color: var(--brand-yellow);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 8px;
        }

        .nav-links { list-style: none; padding: 0; margin: 0; }
        .nav-links li { margin-bottom: 12px; }
        .nav-links a {
            display: block;
            padding: 12px 16px;
            color: #94a3b8;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        .nav-links a:hover { background-color: #1e293b; color: var(--brand-white); }
        .nav-links a.active { background-color: var(--brand-yellow); color: var(--brand-slate); }

        .main-content {
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .email-section {
            display: none;
            width: 100%;
            max-width: 800px;
            background: var(--brand-white);
            border: 1px solid var(--brand-gray);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .email-section.active { display: block; }

        .email-header {
            background: #f1f5f9;
            padding: 24px;
            border-bottom: 1px solid var(--brand-gray);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .subject-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 800;
            margin-bottom: 6px;
        }
        .subject-line {
            font-size: 18px;
            font-weight: 600;
            color: var(--brand-slate);
        }

        .action-buttons {
            display: flex;
            gap: 12px;
        }
        
        .btn {
            background-color: var(--brand-white);
            color: var(--brand-slate);
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px 16px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn:hover { background-color: #f8fafc; border-color: #94a3b8; }
        
        .btn-primary { background-color: var(--brand-slate); color: var(--brand-white); border-color: var(--brand-slate); }
        .btn-primary:hover { background-color: #1e293b; border-color: #1e293b; color: white; }

        .email-preview {
            background: #cbd5e1;
            padding: 40px 0;
            transition: background 0.3s ease;
        }
        
        /* Dark Mode Toggle CSS overrides */
        .email-preview.dark-mode-sim {
            background: #000000;
        }
        .email-preview.dark-mode-sim table.email-wrapper {
            background-color: #121212 !important;
            border-color: #333333 !important;
        }
        .email-preview.dark-mode-sim .text-dark { color: #ffffff !important; }
        .email-preview.dark-mode-sim .text-muted { color: #a1a1aa !important; }
        .email-preview.dark-mode-sim .bg-light { background-color: #1e1e1e !important; }

        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--brand-slate);
            color: var(--brand-white);
            padding: 16px 24px;
            border-radius: 8px;
            transform: translateY(150px);
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .toast.show { transform: translateY(0); }
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="logo-container">
            <h1>HAHU PITCH</h1>
            <p class="subtitle">B2B Partner Sequence</p>
        </div>
        <ul class="nav-links">
''')

    for i in range(1, 7):
        html_parts.append(f'            <li><a href="#week-{i}" onclick="showEmail({i}, this)">Week {i}</a></li>\n')
    
    html_parts.append('''        </ul>
    </div>
    <div class="main-content">
''')

    for i in range(1, 7):
        email_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Email Week {i}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
    <!-- WRAPPER TABLE FOR OUTLOOK MAX WIDTH -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 40px 10px; font-family: 'Inter', Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" class="email-wrapper" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; width: 100%; max-width: 600px; margin: 0 auto; table-layout: fixed;">
            
            <!-- HEADER REMOVED: Jacques standard prefers text/proof over comic art for principals -->
            
            <!-- BODY CONTENT -->
            <tr>
              <td style="padding: 40px 40px 10px 40px;" class="text-dark">
                {get_email_content(i)}
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 20px 0;">
                    <tr>
                        <td>
                            <p class="text-muted" style="margin: 0 0 4px 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; color: #64748b; line-height: 1.6;">Wishing you the best,</p>
                            <p class="text-dark" style="margin: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 18px; color: #0f172a; font-weight: 800;">Sam</p>
                            <p class="text-muted" style="margin: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 13px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Hunger Action Heroes</p>
                        </td>
                    </tr>
                </table>
              </td>
            </tr>
            
            <!-- FOOTER -->
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <tr>
                        <td align="center" style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                            <p style="margin: 0 0 8px 0;">
                                <a href="#" style="color: #64748b; text-decoration: none; font-weight: bold; margin: 0 8px;">Website</a> | 
                                <a href="#" style="color: #64748b; text-decoration: none; font-weight: bold; margin: 0 8px;">Facebook</a> | 
                                <a href="#" style="color: #64748b; text-decoration: none; font-weight: bold; margin: 0 8px;">Instagram</a>
                            </p>
                            <p style="margin: 0 0 8px 0;">[Physical Address Placeholder]</p>
                            <p style="margin: 0;"><a href="#" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a></p>
                        </td>
                    </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
</body>
</html>'''

        html_parts.append(f'''
        <div id="week-{i}" class="email-section">
            <div class="email-header">
                <div class="subject-container">
                    <div class="subject-label">SUBJECT LINE:</div>
                    <div class="subject-line">{subjects[i-1]}</div>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="toggleDarkMode({i})">🌓 TOGGLE DARK MODE</button>
                    <button class="btn btn-primary" onclick="copyHTML({i})">COPY HTML</button>
                </div>
            </div>
            <div class="email-preview" id="email-content-{i}"></div>
            <textarea id="raw-html-{i}" style="display:none;">{email_html}</textarea>
        </div>
''')

    html_parts.append('''
    </div>
    <div class="toast" id="toast">Copied to clipboard! 📋✨</div>

    <script>
        for(let i=1; i<=6; i++) {
            const rawHtml = document.getElementById('raw-html-' + i).value;
            // Inject html but process classes for simulation
            document.getElementById('email-content-' + i).innerHTML = rawHtml;
        }

        function toggleDarkMode(week) {
            const preview = document.getElementById('email-content-' + week);
            preview.classList.toggle('dark-mode-sim');
        }

        function showEmail(weekNumber, linkElement) {
            document.querySelectorAll('.email-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
            document.getElementById('week-' + weekNumber).classList.add('active');
            
            if (linkElement) {
                linkElement.classList.add('active');
            } else {
                document.querySelector(`.nav-links a[href="#week-${weekNumber}"]`).classList.add('active');
            }
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        function copyHTML(weekNumber) {
            const rawHtml = document.getElementById('raw-html-' + weekNumber).value;
            navigator.clipboard.writeText(rawHtml).then(() => showToast('HTML Copied to clipboard! 📋✨'));
        }
        
        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#week-')) {
                const week = hash.replace('#week-', '');
                showEmail(week, document.querySelector(`.nav-links a[href="${hash}"]`));
            } else {
                showEmail(1, document.querySelector('.nav-links a'));
            }
        });
    </script>
</body>
</html>
''')

    with open(HTML_OUTPUT, 'w', encoding='utf-8') as f:
        f.write("".join(html_parts))

if __name__ == '__main__':
    build_full_html()
    print("Successfully generated bulletproof HTML emails and upgraded portal UI.")

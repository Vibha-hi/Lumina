import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface InfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: "about" | "privacy";
}

export function InfoDialog({ isOpen, onOpenChange, type }: InfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] glass-strong border-glass-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type === "about" ? "About LUMINA.AI" : "Privacy Policy"}</DialogTitle>
          <DialogDescription>
            {type === "about" ? "Hackathon Project for UNESCO" : "Last Updated: August 15, 2026"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 text-sm text-muted-foreground leading-relaxed mt-2">
          {type === "about" ? (
            <div className="space-y-8 pr-2">
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">Turn Your Ideas Into Better Writing</h3>
                <p><strong className="text-foreground">LUMINA.AI is an AI-powered writing analysis platform designed to help you understand, evaluate, and improve your writing.</strong></p>
                <p>Whether you're working on an essay, application, report, professional document, or simply trying to communicate an idea more clearly, LUMINA.AI gives you structured insights into your writing so you can make better decisions about what to change.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">Why LUMINA.AI?</h3>
                <p>Writing is more than grammar.</p>
                <p>A piece of writing can be grammatically correct and still be unclear, repetitive, poorly structured, or fail to communicate its intended message.</p>
                <p>LUMINA.AI was built around a simple idea:</p>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 italic">
                  <strong className="text-foreground">Don't just tell users what's wrong. Help them understand why it matters and how they can improve it.</strong>
                </div>
                <p>Instead of simply correcting your text, LUMINA.AI analyzes different aspects of your writing and presents the results in a way that is easy to understand and act upon.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">What LUMINA.AI Can Do</h3>
                
                <div className="space-y-2 mt-4">
                  <h4 className="text-foreground font-medium">✦ Analyze Your Writing</h4>
                  <p>Submit your writing and receive an analysis of its key characteristics, structure, clarity, and overall effectiveness.</p>
                </div>
                <div className="space-y-2 mt-4">
                  <h4 className="text-foreground font-medium">✦ Identify Areas for Improvement</h4>
                  <p>LUMINA.AI can highlight potential issues such as:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Unclear sentences</li>
                    <li>Repetition</li>
                    <li>Weak structure</li>
                    <li>Inconsistent tone</li>
                    <li>Poor transitions</li>
                    <li>Unnecessary wording</li>
                    <li>Lack of clarity</li>
                    <li>Other writing-related issues</li>
                  </ul>
                </div>
                <div className="space-y-2 mt-4">
                  <h4 className="text-foreground font-medium">✦ Give Actionable Feedback</h4>
                  <p>Instead of overwhelming you with corrections, LUMINA.AI organizes feedback into meaningful insights that you can actually use.</p>
                </div>
                <div className="space-y-2 mt-4">
                  <h4 className="text-foreground font-medium">✦ Help You Understand Your Writing</h4>
                  <p>The goal isn't simply to replace your words with AI-generated text.</p>
                  <p>LUMINA.AI is designed to help you understand <strong className="text-foreground">what is working, what isn't, and why</strong>.</p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">How It Works</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">01 — Submit</div>
                    <div className="text-sm">Provide the text you want LUMINA.AI to analyze.</div>
                  </div>
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">02 — Analyze</div>
                    <div className="text-sm">Our AI-powered analysis processes the content you explicitly submit and evaluates it according to the selected analysis features.</div>
                  </div>
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">03 — Understand</div>
                    <div className="text-sm">Receive structured insights about your writing.</div>
                  </div>
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">04 — Improve</div>
                    <div className="text-sm">Use those insights to revise your work and make your own improvements.</div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">Built With Privacy in Mind</h3>
                <p>Your writing belongs to you.</p>
                <p>LUMINA.AI does <strong className="text-foreground">not use your submitted content to train AI models or improve LUMINA.AI</strong>.</p>
                <p>Your content is processed only as necessary to provide the functionality you request.</p>
                <p>We also do not sell your personal information or your submitted content to advertisers.</p>
                <p>For more information about how your information is handled, please see our <strong className="text-foreground">Privacy Policy</strong>.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">Our Philosophy</h3>
                <div className="space-y-2 mt-4">
                  <h4 className="text-foreground font-medium">AI Should Assist, Not Replace.</h4>
                  <p>We believe AI works best when it helps people think more clearly rather than simply doing the thinking for them.</p>
                  <p>LUMINA.AI is designed to provide insight, context, and actionable feedback while keeping <strong className="text-foreground">you</strong> in control of your writing.</p>
                  <p>Your ideas remain your ideas.</p>
                  <p>The goal is not to make every piece of writing sound like AI.</p>
                  <p>The goal is to help you make your writing <strong className="text-foreground">more effective while keeping your own voice.</strong></p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">Who Is LUMINA.AI For?</h3>
                <p>LUMINA.AI can be useful for anyone who wants another perspective on their writing, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Students</li>
                  <li>Researchers</li>
                  <li>Professionals</li>
                  <li>Content creators</li>
                  <li>Applicants</li>
                  <li>Developers and technical writers</li>
                  <li>Anyone working with written communication</li>
                </ul>
                <p className="mt-2">Whether you're writing your first draft or polishing the final version, LUMINA.AI can help you see your writing from another perspective.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">Our Approach to AI</h3>
                <p>LUMINA.AI uses modern AI technologies to analyze the content you provide.</p>
                <p>However, AI-generated feedback should be treated as <strong className="text-foreground">assistance, not absolute truth</strong>.</p>
                <p>AI can misunderstand context, intent, nuance, or specialized terminology. We encourage users to review suggestions critically and make the final decisions about their work.</p>
              </section>

              <section className="space-y-4 mt-8 pt-8 border-t border-glass-border">
                <h3 className="text-xl font-bold text-foreground mb-4">Your Data. Your Control.</h3>
                <p className="mb-4">We believe transparency should be part of the product. You should know:</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">What we collect</div>
                    <div className="text-sm">Information necessary to provide your account and the content you explicitly submit.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Why we process it</div>
                    <div className="text-sm">To provide the functionality you request.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we train AI models using your content?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we use your content to improve LUMINA.AI?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we sell your data?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground/60 italic pt-4">
                  For complete details, read our <strong className="text-foreground">Privacy Policy</strong>.
                </div>
              </section>
              
              <section className="mt-8 pt-8 border-t border-glass-border text-center space-y-4">
                <h3 className="text-xl font-bold text-foreground">Built to Make Writing Clearer</h3>
                <p>LUMINA.AI isn't here to tell you what to write.</p>
                <p>It's here to help you understand what you've already written.</p>
                <p className="text-lg"><strong className="text-foreground gradient-text">Write. Analyze. Understand. Improve.</strong></p>
                <h4 className="text-2xl font-bold text-foreground mt-6">Welcome to LUMINA.AI.</h4>
              </section>
            </div>
          ) : (
            <div className="space-y-8 pr-2">
              <div className="space-y-4">
                <p>LUMINA.AI ("LUMINA.AI", "we", "us", or "our") respects your privacy and is committed to protecting the information you provide when using our application.</p>
                <p>This Privacy Policy explains what information we collect, how we use and protect it, when it may be shared with third-party service providers, and the choices available to you. By accessing or using LUMINA.AI, you acknowledge the practices described in this Privacy Policy.</p>
              </div>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">1. Information We Collect</h3>
                
                <div className="space-y-2">
                  <h4 className="text-foreground font-medium">1.1 Information You Provide</h4>
                  <p>When you use LUMINA.AI, we may collect information that you voluntarily provide, including:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-foreground">Name</strong></li>
                    <li><strong className="text-foreground">Email address</strong></li>
                    <li>Account and authentication information</li>
                    <li>Text, drafts, prompts, or other content that you explicitly submit for analysis</li>
                    <li>Feedback, support requests, or other communications you voluntarily provide</li>
                  </ul>
                  <p>We only collect information that is reasonably necessary to provide the functionality of the application.</p>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="text-foreground font-medium">1.2 Content You Submit</h4>
                  <p>LUMINA.AI processes text and other content that you explicitly submit to the application. For example, this may include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A draft submitted for analysis</li>
                    <li>Text entered into an analysis field</li>
                    <li>Prompts or instructions</li>
                    <li>Feedback submitted through the application</li>
                  </ul>
                  <p>We do not intentionally access content that you have not submitted to LUMINA.AI for processing.</p>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="text-foreground font-medium">1.3 Automatically Collected Technical Information</h4>
                  <p>When you use the application, certain technical information may be generated automatically as part of normal application operation. This may include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Request timestamps</li>
                    <li>Account or session identifiers</li>
                    <li>Device or browser information</li>
                    <li>IP address or approximate network information, where technically necessary</li>
                    <li>Application error and diagnostic information</li>
                    <li>Security and authentication logs</li>
                  </ul>
                  <p>This information is used primarily to operate, secure, and maintain the service.</p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">2. How We Use Your Information</h3>
                <p>We use the information we collect for specific and limited purposes, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Creating and managing your account</li>
                  <li>Authenticating users</li>
                  <li>Providing LUMINA.AI's analysis features</li>
                  <li>Processing content that you explicitly submit</li>
                  <li>Providing access to your saved drafts or analysis history</li>
                  <li>Responding to support requests and feedback</li>
                  <li>Maintaining application security</li>
                  <li>Detecting and preventing abuse, fraud, or unauthorized access</li>
                  <li>Diagnosing technical problems</li>
                  <li>Complying with applicable legal obligations</li>
                </ul>

                <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <h4 className="text-foreground font-semibold mb-2">We Do Not Use Your Content to Improve LUMINA.AI</h4>
                  <p className="mb-2">Your submitted content is <strong className="text-foreground">not used to train, fine-tune, or improve artificial intelligence models</strong>.</p>
                  <p className="mb-2">We also do <strong className="text-foreground">not</strong> use your submitted content to:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Train AI models</li>
                    <li>Fine-tune AI models</li>
                    <li>Improve LUMINA.AI's algorithms</li>
                    <li>Develop or test new LUMINA.AI features</li>
                    <li>Build user profiles for advertising</li>
                    <li>Sell or license your content</li>
                    <li>Provide advertising or marketing recommendations</li>
                    <li>Analyze your content for purposes unrelated to the functionality you requested</li>
                  </ul>
                  <p>Your content is processed to provide the service you requested and is not treated as a source of training data.</p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">3. AI Processing</h3>
                <p>Some LUMINA.AI features use third-party artificial intelligence services to generate analysis or other requested results.</p>
                <p>When you submit content for AI analysis, the relevant content may be securely transmitted to an authorized AI service provider for the limited purpose of processing your request. These providers are selected based on their security and data-handling practices.</p>
                <p>Where supported by the services we use, we utilize enterprise AI infrastructure with <strong className="text-foreground">zero-retention or equivalent contractual data-protection commitments</strong>.</p>
                <p>The information sent to these providers is not intentionally used by LUMINA.AI for AI model training or product improvement.</p>
                <p>You should avoid submitting highly sensitive personal information that is unnecessary for the analysis you are requesting.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">4. Data Storage and Retention</h3>
                <p>LUMINA.AI may store certain information necessary to provide application functionality. For example, we may retain:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Account information</li>
                  <li>Submitted drafts</li>
                  <li>Analysis history</li>
                  <li>Feedback</li>
                  <li>Technical and security logs</li>
                  <li>Information necessary to maintain your account and application session</li>
                </ul>
                
                <h4 className="text-foreground font-medium mt-4">Why We Retain Data</h4>
                <p>Data may be retained to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide your requested features</li>
                  <li>Allow you to access your previous drafts or analyses</li>
                  <li>Maintain account functionality</li>
                  <li>Maintain application security</li>
                  <li>Detect abuse or unauthorized activity</li>
                  <li>Resolve technical problems</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p className="mt-2">We do not retain information indefinitely without a legitimate operational, security, or legal reason. When information is no longer required for these purposes, we may delete or anonymize it in accordance with our retention practices.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">5. Data Security</h3>
                <p>We take reasonable technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction.</p>
                <p>Depending on the type of information and service involved, security measures may include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Encryption during transmission</li>
                  <li>Secure authentication</li>
                  <li>Access controls</li>
                  <li>Restricted access to stored information</li>
                  <li>Secure database infrastructure</li>
                  <li>Monitoring for unauthorized access</li>
                  <li>Security and error logging</li>
                </ul>
                <p className="mt-2">However, no internet-based service can guarantee absolute security. Users should therefore avoid submitting passwords, authentication codes, payment credentials, or other extremely sensitive information unless it is specifically required by the service.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">6. Third-Party Service Providers</h3>
                <p>LUMINA.AI may use trusted third-party providers to operate certain parts of the application. These providers may provide services such as:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>AI processing</li>
                  <li>Cloud hosting</li>
                  <li>Database infrastructure</li>
                  <li>Authentication</li>
                  <li>Security</li>
                  <li>Application monitoring</li>
                  <li>Technical infrastructure</li>
                </ul>
                <p className="mt-2">Third-party providers may process information only as necessary to provide the services they perform for LUMINA.AI.</p>
                <p>We do not authorize these providers to use your submitted content for unrelated advertising purposes. Where applicable, we seek contractual and technical protections designed to limit how third-party providers may process user information.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">7. Data Sharing</h3>
                <p>We do not sell your personal information.</p>
                <p>We do not sell, rent, or provide your submitted content to advertisers.</p>
                <p>We may share limited information with service providers when necessary to operate LUMINA.AI or provide functionality that you have requested.</p>
                <p>We may also disclose information when reasonably necessary to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Comply with applicable law</li>
                  <li>Respond to valid legal processes</li>
                  <li>Protect the security of LUMINA.AI</li>
                  <li>Investigate fraud or abuse</li>
                  <li>Prevent unauthorized use of the service</li>
                  <li>Protect the rights, safety, or property of LUMINA.AI, its users, or others</li>
                </ul>
                <p className="mt-2">Any disclosure made for these purposes will be limited to what is reasonably necessary where practicable.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">8. Advertising and Tracking</h3>
                <p>LUMINA.AI does not sell user information to advertisers.</p>
                <p>We do not intentionally track your browsing activity across unrelated websites.</p>
                <p>We do not use your submitted content to create advertising profiles or determine advertisements to show you.</p>
                <p>LUMINA.AI may use essential technical mechanisms, such as cookies or session technologies, when necessary for authentication, security, and normal application functionality.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">9. Cookies and Similar Technologies</h3>
                <p>LUMINA.AI may use cookies or similar technologies for purposes such as:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keeping users authenticated</li>
                  <li>Maintaining secure sessions</li>
                  <li>Remembering necessary application settings</li>
                  <li>Preventing unauthorized access</li>
                  <li>Understanding basic technical errors</li>
                </ul>
                <p className="mt-2">These technologies are intended to support the operation and security of the application rather than to monitor your activity across unrelated websites.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">10. Your Content</h3>
                <p>You retain your rights to the content you submit to LUMINA.AI.</p>
                <p>By submitting content, you provide LUMINA.AI with the limited permission necessary to:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Receive your content;</li>
                  <li>Store it where required to provide the requested functionality;</li>
                  <li>Process it through authorized infrastructure;</li>
                  <li>Generate the requested analysis or response; and</li>
                  <li>Display the resulting information to you.</li>
                </ol>
                <p className="mt-2">This permission exists only for the purposes necessary to provide and operate the service.</p>
                <p><strong className="text-foreground">LUMINA.AI does not claim ownership of your submitted content.</strong></p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">11. Account and Data Deletion</h3>
                <p>You may request deletion of your LUMINA.AI account and associated personal information.</p>
                <p>Where applicable, deleting your account may also result in the deletion of stored drafts, analysis history, and other information associated with that account.</p>
                <p>Some information may need to be retained for a limited period where necessary for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Legal compliance</li>
                  <li>Security</li>
                  <li>Fraud prevention</li>
                  <li>Resolving disputes</li>
                  <li>Maintaining required business records</li>
                </ul>
                <p className="mt-2">After the applicable retention period, such information will be deleted or anonymized in accordance with our practices.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">12. Access, Correction, and Privacy Requests</h3>
                <p>Depending on applicable law and the functionality available in LUMINA.AI, you may have the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Request access to personal information associated with your account</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of personal information</li>
                  <li>Request information about how your data is processed</li>
                  <li>Withdraw consent where processing is based on consent</li>
                  <li>Raise concerns regarding our handling of personal information</li>
                </ul>
                <p className="mt-2">To make a privacy-related request, contact us using the contact information provided within the LUMINA.AI application.</p>
                <p>We may need to verify your identity before completing certain requests in order to protect your account and information.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">13. Children's Privacy</h3>
                <p>LUMINA.AI does not knowingly collect personal information from children where such collection is prohibited by applicable law.</p>
                <p>If you believe that a child has provided personal information to LUMINA.AI without appropriate authorization, please contact us.</p>
                <p>If we become aware that we have collected information in circumstances where we should not have done so, we will take reasonable steps to address the situation.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">14. International Data Processing</h3>
                <p>Depending on the infrastructure and third-party services used by LUMINA.AI, your information may be processed or stored on servers located outside your state or country.</p>
                <p>Where information is transferred across jurisdictions, we take reasonable steps to ensure that appropriate contractual, technical, and organizational safeguards are applied as required by applicable law.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">15. Legal Compliance</h3>
                <p>We may collect, use, preserve, or disclose information where reasonably necessary to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Comply with applicable laws and regulations</li>
                  <li>Respond to lawful requests from authorities</li>
                  <li>Enforce our terms and policies</li>
                  <li>Investigate security incidents</li>
                  <li>Prevent fraud, abuse, or illegal activity</li>
                  <li>Protect the rights and safety of users or other individuals</li>
                </ul>
                <p className="mt-2">Where legally permitted, we will seek to limit such disclosures to the information reasonably necessary for the relevant purpose.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">16. Changes to This Privacy Policy</h3>
                <p>We may update this Privacy Policy from time to time to reflect changes in:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Our services</li>
                  <li>Data-processing practices</li>
                  <li>Security measures</li>
                  <li>Third-party service providers</li>
                  <li>Applicable laws or regulations</li>
                </ul>
                <p className="mt-2">When we make significant changes, we may provide additional notice through the application or other appropriate means.</p>
                <p>The <strong className="text-foreground">"Last Updated"</strong> date at the top of this Privacy Policy will indicate when the policy was most recently revised.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-glass-border pb-2">17. Contact Us</h3>
                <p>If you have questions, concerns, or requests regarding this Privacy Policy or the way LUMINA.AI handles your information, please contact the LUMINA.AI team through the contact details provided within the application.</p>
                <p>We will make reasonable efforts to review and respond to privacy-related requests.</p>
              </section>

              <section className="space-y-4 mt-8 pt-8 border-t border-glass-border">
                <h3 className="text-xl font-bold text-foreground mb-4">18. Privacy at a Glance</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">What we collect</div>
                    <div className="text-sm">Your name, email address, submitted content, and limited technical information.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Why we process your content</div>
                    <div className="text-sm">To provide the analysis or functionality you explicitly request.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we train AI models using your content?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we use your content to improve LUMINA.AI?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we sell your information?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we sell your content to advertisers?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Do we track your browsing history?</div>
                    <div className="text-sm text-foreground font-bold">No.</div>
                  </div>
                  
                  <div className="glass-strong rounded-xl p-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Can you request deletion of your data?</div>
                    <div className="text-sm">Yes, subject to applicable legal and operational retention requirements.</div>
                  </div>
                </div>

                <div className="glass-strong rounded-xl p-4 mt-4">
                    <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Can third-party AI providers process your content?</div>
                    <div className="text-sm">Yes. When an AI-powered feature is used, the relevant content may be securely transmitted to an authorized AI provider solely to generate the requested result.</div>
                </div>
              </section>
              
              <div className="text-xs text-muted-foreground/60 italic pt-6 pb-2 border-t border-glass-border">
                This Privacy Policy is intended to provide transparency about LUMINA.AI's data practices. It should be reviewed by a qualified legal or privacy professional before being adopted as the application's final legally binding privacy policy, particularly if LUMINA.AI will operate in multiple jurisdictions or process sensitive personal information.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

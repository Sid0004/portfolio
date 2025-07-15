import { useState, useRef, useEffect } from 'react';
import './App.css';
import SplitText from './SplitText';
import Lanyard from './Lanyard';
import axios from 'axios';

// Type definitions for history items
type HistoryItem = 
  | { type: 'input'; value: string }
  | { type: 'output'; value: string }
  | { type: 'output'; value: { error: boolean; message: string; details: string } };

const COMMANDS = {

    help: `Available commands:
  about - Learn about me
  projects - View my projects
  skills - See my technical skills
  experience - My work experience
  contact - How to reach me
  education - My educational background
  certifications - View my certifications
  leadership - Leadership and community involvement
  clear - Clear the terminal
  exit - Return to the welcome page

🤖 AI Assistant: Type any question or command to chat with AI!
Examples: "What's the weather like?", "Explain React hooks", "Write a Python function"`,
  
    about: `Siddhant Sharma is a final-year B.Tech Computer Science student and passionate Software Engineer. He specializes in building scalable full-stack applications with real-time collaboration features. With a strong foundation in C++, React, Node.js, and AI/ML, he enjoys working on interdisciplinary solutions involving AI, sustainability, and smart systems.`,
  
    projects: `DevMeet - A collaborative coding platform with video calling, real-time code editing using CodeMirror + Liveblocks, and user authentication.
  NeuroShell - An AI-powered command-line assistant that helps users manage files, generate code, and automate terminal tasks.
  Ethical Consumer Advisor - An AI tool that helps users make informed and ethical purchasing decisions.
  Sign Language to Text Converter - A deep learning project converting sign language gestures to text.
  Portfolio Terminal - A personal retro-style terminal portfolio using React, TypeScript, and CSS.`,
  
  skills: `
  • Programming Languages: C++, JavaScript, TypeScript, Python  
  • Frontend Development: React, Next.js, Tailwind CSS, Shadcn/UI, HTML5, CSS3  
  • Backend Development: Node.js, Express.js, MongoDB, Mongoose, REST APIs, WebSockets  
  • Real-time & Collaboration: CodeMirror, Liveblocks, Yjs    
  • Tools & Platforms: Git, GitHub, Firebase, Postman, VS Code, Vercel 
  • Project & Version Control: Git Workflow, Team Collaboration, Agile principles
  `
  ,
  
  experience: `
  • Team Lead, College Software Projects  
    Led multiple collaborative software development projects during B.Tech, including real-time web apps and AI/ML-based tools. Oversaw project planning, task delegation, and code quality using Git, Agile methods, and modern tech stacks.
  
  • Hackathon Enthusiast — National & Global Participation  
    Actively participated in major hackathons including Smart India Hackathon (SIH), TCS CodeVita, and the Google Agentic AI Hackathon. Built practical, scalable solutions while working under strict deadlines and in diverse teams.
  
  • Contributor, Campus Tech Initiatives  
    Engaged in technical fests, coding events, and open-source contributions. Applied C++, JavaScript, React, and AI/ML skills to solve real-world challenges.
  
  • Looking Ahead to Industry Exposure  
    Actively seeking opportunities to contribute in real-world environments. Excited to bring technical skills, leadership experience, and team spirit to impactful software engineering roles.
  `
,  
  
    contact: `Email: siddhantsharma4uonly@gmail.com
LinkedIn: linkedin.com/in/siddhantsharma27
GitHub:github.com/Sid0004`,
  
              education: `
               B.Tech in Computer Science and Engineering  
                Greater Noida Institute of Technology (GNIOT) — Expected 2026
              `
              ,
  
              certifications: `
              • C++ Programming Certification  
              • Data Structures and Algorithms Training  
              • AI/ML with Python Workshop  
              • Introduction to Cybersecurity Essentials
              `,
  
              leadership: `
              • Team Leader – Led multiple college-level hackathons and software development projects, managing both technical direction and team coordination.  
              • Tech Club & GDSC Lead – Organized workshops, coding events, and mentored peers in DSA and full-stack development.  
              • Peer Mentor – Actively helped juniors and teammates with debugging, project structure, and concept clarity in C++, React, and backend tools.  
              • Communicative & Observant – Known for checking in on peers, fostering collaboration, and spotting overlooked bugs and design flaws.
              `
              ,
  
    sudo: `Permission denied: You're not in the sudoers file. This incident will be reported.`
  
  
};
const SIDDHANT_PROFILE = {
  fullName: "Siddhant Sharma",
  degree: "B.Tech in Computer Science, final year (GNIOT, expected 2026)",
  email: "siddhantsharma4uonly@gmail.com",
  linkedIn: "https://linkedin.com/in/siddhantsharma27",
  github: "https://github.com/Sid0004",
  skills: [
    "C++", "JavaScript", "TypeScript", "Python",
    "React", "Next.js", "Tailwind CSS", "Shadcn/UI",
    "Node.js", "Express", "MongoDB", "REST APIs", "WebSockets",
    "AI/ML", "CodeMirror", "Liveblocks", "Yjs", "Firebase",
    "Git", "GitHub", "VS Code", "Postman"
  ],
  flagshipProject: "DevMeet — a real-time collaborative code editor with video calling using CodeMirror, Liveblocks, and WebRTC.",
  projects: [
    {
      name: "DevMeet",
      description: "A collaborative coding platform with video calling, real-time code editing using CodeMirror + Liveblocks, and user authentication."
    },
    {
      name: "NeuroShell",
      description: "An AI-powered command-line assistant that helps users manage files, generate code, and automate terminal tasks."
    },
    {
      name: "Ethical Consumer Advisor",
      description: "An AI tool that helps users make informed and ethical purchasing decisions."
    },
    {
      name: "Sign Language to Text Converter",
      description: "A deep learning project converting sign language gestures to text."
    },
    {
      name: "Portfolio Terminal",
      description: "A personal retro-style terminal portfolio using React, TypeScript, and CSS."
    }
  ],
  interests: [
    "Building full-stack apps",
    "AI agents",
    "Hackathons",
    "DSA (Data Structures & Algorithms)",
    "Gym",
    "Chess",
    "Novels",
    "Learning new tech"
  ],
  personality: "Helpful, witty, a little sarcastic, but always friendly and informative.",
  preferredTopics: [
    "Software Engineering",
    "Projects",
    "Tech stack",
    "Problem-solving",
    "Career"
  ],
  majorAchievements: [
    "Built DevMeet from scratch",
    "Participated in hackathons including SIH, TCS CodeVita, Google Agentic AI",
    "Open-source contributions",
    "Team Leader – Tech Club & GDSC, peer mentoring"
  ],
  certifications: [
    "C++ Programming Certification",
    "Data Structures and Algorithms Training",
    "AI/ML with Python Workshop",
    "Introduction to Cybersecurity Essentials"
  ],
  education: [
    "B.Tech in Computer Science and Engineering, GNIOT (Expected 2026)"
  ],
  leadership: [
    "Team Leader – Various college-level hackathons and software projects",
    "Tech Club & GDSC Lead – Organized events and mentored peers",
    "Proactive Communicator – Known for checking in on peers and spotting bugs others miss"
  ],
  avoidTopics: [
    "Celebrity gossip",
    "Politics",
    "Travel (unless it relates to tech events)"
  ],
  funFacts: [
    "Enjoys gym sessions and novels",
    "Loves clean, minimal UI",
    "Spots bugs others miss"
  ],
  contact: {
    email: "siddhantsharma4uonly@gmail.com",
    linkedIn: "https://linkedin.com/in/siddhantsharma27",
    github: "https://github.com/Sid0004"
  }
};


const SYSTEM_CONTEXT = `
You are the AI terminal assistant for Siddhant Sharma — a final-year B.Tech Computer Science student and passionate Software Engineer. Speak as if you know everything about Siddhant. Be concise, helpful, occasionally funny or sarcastic. Answer any question using Siddhant's background, skills, projects, or interests. If irrelevant, reply briefly and redirect to portfolio-related topics.
`.trim();

function App() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', value: 'Type any command to continue...\n\n💡 Tip: You can ask me anything! Try "help" for commands or ask any question for AI assistance.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typedOutput, setTypedOutput] = useState('');
  const [pendingOutput, setPendingOutput] = useState<string | null>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0); // 0: Welcome, 1: I'm Siddhant Sharma, 2: Terminal
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [showExit, setShowExit] = useState(false);
  // Remove theme state and button
  // Remove theme class from root div
  // Restore root div to:
  // <div className={`portfolio-root${showTerminal ? ' terminal-fade-in' : ''}`}> 
  // ...rest of your app...
  // Remove theme-toggle-btn from header
  // ... existing code ...

  useEffect(() => {
    if (showWelcome) {
      if (welcomeStep === 0) {
        const timer = setTimeout(() => setWelcomeStep(1), 2500);
        return () => clearTimeout(timer);
      } else if (welcomeStep === 1) {
        const timer = setTimeout(() => {
          setShowWelcome(false);
          setWelcomeStep(2);
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [showWelcome, welcomeStep]);

  // Fade-in animation for terminal
  const [showTerminal, setShowTerminal] = useState(false);
  useEffect(() => {
    if (!showWelcome) {
      setTimeout(() => setShowTerminal(true), 100); // slight delay for fade-in
    }
  }, [showWelcome]);

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [history, typedOutput]);

  useEffect(() => {
    if (pendingOutput !== null) {
      setTyping(true);
      setTypedOutput('');
      let i = 0;
      const interval = setInterval(() => {
        setTypedOutput(pendingOutput.slice(0, i + 1));
        i++;
        if (i >= pendingOutput.length) {
          clearInterval(interval);
          setTyping(false);
          setPendingOutput(null);
          setHistory(prev => [
            ...prev.slice(0, -1),
            { type: 'output', value: pendingOutput }
          ]);
        }
      }, 12);
      return () => clearInterval(interval);
    }
  }, [pendingOutput]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    const width = canvas.width;
    const height = canvas.height;
    const barCount = 16;
    const barWidth = width / (barCount + 2);

    function drawVisualizer(active: boolean) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      let x = barWidth;
      for (let i = 0; i < barCount; i++) {
        // If typing, fluctuate bars randomly, else show small idle bars
        const fluctuation = active ? (Math.random() * 0.7 + 0.3) : (Math.random() * 0.1 + 0.05);
        const barHeight = fluctuation * height * (active ? (0.7 + 0.3 * Math.sin(Date.now()/200 + i)) : 0.3);
        ctx.strokeStyle = active ? '#00bfff' : '#222';
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, height - barHeight);
        ctx.stroke();
        x += barWidth;
      }
    }

    function animate() {
      drawVisualizer(typing);
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [typing]);

  useEffect(() => {
    // Send profile to backend on first load
    axios.post('/api/gemini/init', { profile: SIDDHANT_PROFILE }).catch(() => {});
  }, []);

  // Autofocus terminal input on any keypress if not already focused
  useEffect(() => {
    function handleGlobalKeydown(e: KeyboardEvent) {
      // Ignore if input is already focused, or if modifier keys are pressed
      if (
        document.activeElement === inputRef.current ||
        e.metaKey || e.ctrlKey || e.altKey || e.isComposing ||
        // Ignore if focus is on a button, link, textarea, or contenteditable
        ["BUTTON", "A", "TEXTAREA"].includes(document.activeElement?.tagName || "") ||
        (document.activeElement && (document.activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }
      // Only focus for visible characters (not Tab, Shift, etc)
      if (e.key.length === 1) {
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    // Built-in commands
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }
    if (trimmedCmd === 'exit') {
      setShowExit(true);
      setShowWelcome(false);
      setWelcomeStep(0);
      return;
    }
    if (COMMANDS[trimmedCmd as keyof typeof COMMANDS]) {
      const output = COMMANDS[trimmedCmd as keyof typeof COMMANDS];
      setHistory((prev) => [
        ...prev,
        { type: 'input', value: trimmedCmd },
        { type: 'output', value: '' } // placeholder for typing
      ]);
      setPendingOutput(output);
      return;
    }
    // AI fallback for any other command
    if (!trimmedCmd) return;
    setLastPrompt(trimmedCmd); // Store last prompt for retry
    setHistory(prev => [
      ...prev,
      { type: 'input', value: trimmedCmd },
      { type: 'output', value: 'AI assistant is thinking...' }
    ]);
    try {
      const response = await axios.post('/api/gemini', { prompt: SYSTEM_CONTEXT + '\nUser: ' + trimmedCmd });
      const aiReply = response.data.text || "AI could not generate a response.";
      setHistory(prev => [
        ...prev.slice(0, -1),
        { type: 'output', value: aiReply }
      ]);
    } catch (error: any) {
      setHistory(prev => [
        ...prev.slice(0, -1),
        { type: 'output', value: { error: true, message: 'AI service is temporarily unavailable. Please try again.', details: error.message || 'Unknown error' } }
      ]);
    }
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typing) return; // Prevent new command while typing
    const cmd = input.trim();
    if (cmd) {
      handleCommand(cmd);
    }
    setInput('');
    inputRef.current?.focus();
  };

  const handleNavClick = (cmd: string) => {
    if (typing) return;
    handleCommand(cmd);
  };

  // Render history, but for the last output line, show the typing effect if active
  const renderHistory = () => {
    const items = [...history];
    if (typing && items.length > 0) {
      // Replace last output with typing effect
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].type === 'output') {
          items[i] = { ...items[i], value: typedOutput };
          break;
        }
      }
    }
    return items.map((item, idx) => {
      if (item.type === 'input') {
        return (
          <div key={idx} className="terminal-input-line left-align">
            <span className="terminal-prompt-user">siddhant</span>
            <span className="terminal-prompt-symbol">@portfolio:~$</span> {item.value}
          </div>
        );
      } else {
        // Error detection: output starts with 'Command not found:' or 'Permission denied'
        const isError =
          typeof item.value === 'string' &&
          (item.value.startsWith('Command not found:') || item.value.startsWith('Permission denied'));
              // Enhanced error handling for AI errors
      if (typeof item.value === 'object' && 'error' in item.value && item.value.error) {
        return (
          <div key={idx} className="terminal-output-line left-align error">
            {item.value.message}
            <br />
            <span style={{ fontSize: '0.9em', color: '#ffb3b3' }}>({item.value.details})</span>
            {lastPrompt && (
              <div style={{ marginTop: '0.5em' }}>
                <button onClick={() => handleCommand(lastPrompt)} style={{ color: '#fff', background: '#00bfff', border: 'none', borderRadius: '4px', padding: '0.3em 0.8em', cursor: 'pointer' }}>
                  Retry
                </button>
              </div>
            )}
          </div>
        );
      }
      return (
        <pre
          key={idx}
          className={`terminal-output-line left-align${isError ? ' error' : ''}`}
        >
          {typeof item.value === 'string' ? item.value : ''}
        </pre>
      );
      }
    });
  };

  if (showExit) {
    return (
      <div className="goodbye-page" style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', flexDirection: 'column'}}>
        <h1 style={{ color: '#00ff5a', fontSize: '3rem', marginBottom: '1rem' }}>👋 See you soon!</h1>
        <p style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '2rem' }}>You have exited the terminal. Thanks for visiting Siddhant's portfolio.</p>
        <button
          style={{ padding: '0.7em 2em', fontSize: '1.1rem', background: '#00bfff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => { setShowExit(false); setShowWelcome(false); setShowTerminal(true); }}
        >
          Reopen Terminal
        </button>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="welcome-page" style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000'}}>
        <SplitText
          text={welcomeStep === 0 ? 'Welcome' : "I'm Siddhant Sharma"}
          className="welcome-big-text"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />
      </div>
    );
  }

  return (
    <div className={`portfolio-root${showTerminal ? ' terminal-fade-in' : ''}`}>
      <div className="portfolio-top-bar" />
      {/* Header */}
      <header className="portfolio-header">
        <div className="portfolio-title">
          <span className="portfolio-name">Siddhant Sharma</span>
          <span className="portfolio-role">Software Engineer</span>
        </div>
        <nav className="portfolio-nav">
          <a href="#" className="nav-link" onClick={() => handleNavClick('help')}>help</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('about')}>about</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('projects')}>projects</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('skills')}>skills</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('experience')}>experience</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('contact')}>contact</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('education')}>education</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('certifications')}>certifications</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('sudo')}>sudo</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('clear')}>clear</a> |
          <a href="#" className="nav-link" onClick={() => handleNavClick('exit')}>exit</a>
        </nav>
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>
      {/* Main Content */}
      <main className="portfolio-main">
        {/* Left: Animated Visualizer Orb */}
        <section className="orb-section">
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </section>
        {/* Right: Terminal Emulator */}
        <section className="terminal-area">
          <div className="terminal-output" ref={terminalOutputRef}>
            {renderHistory()}
            {/* Inline input at the bottom */}
            <form
              className="terminal-input-form left-align"
              onSubmit={handleInputSubmit}
              autoComplete="off"
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <span className="terminal-prompt-user">siddhant</span>
              <span className="terminal-prompt-symbol">@portfolio:~$</span>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  ref={inputRef}
                  className="terminal-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00ff00',
                    fontSize: '1.1rem',
                    width: `${Math.max(input.length, 1)}ch`,
                    caretColor: 'transparent',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: 0,
                    zIndex: 2,
                  }}
                />
                <span style={{ color: '#00ff00', fontSize: '1.1rem', zIndex: 1 }}>
                  {input}
                  <span className="terminal-cursor-block"></span>
                </span>
              </span>
            </form>
          </div>
        </section>
      </main>
      <div className="portfolio-bottom-bar" />
      {/* Side Menu */}
      <div className={`side-menu${menuOpen ? ' open' : ''}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        <h2>Resources</h2>
        <ul>
          <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a></li>
          <li><a href="https://mail.google.com/mail/?view=cm&to=siddhantsharma4uonly@gmail.com" target="_blank" rel="noopener noreferrer">Gmail</a></li>
          <li><a href="https://github.com/Sid0004" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/siddhantsharma27/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </div>
      {menuOpen && <div className="side-menu-backdrop" onClick={() => setMenuOpen(false)}></div>}
    </div>
  );
}

export default App;

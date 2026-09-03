import { Heading, Paragraph, Label, Link, Alert, Details, Card } from "@digdir/designsystemet-react";
import {
  MonitorIcon,
  FloppydiskIcon,
  ClockIcon,
  CheckmarkCircleIcon,
  WrenchIcon,
  TrashIcon,
} from "@navikt/aksel-icons";
import { GiMonkey } from "react-icons/gi";
import { PiPlantFill } from "react-icons/pi";
import CodeBlock from "./CodeBlock.jsx";
import { TerminalIcon } from "@navikt/aksel-icons";
import { FaApple } from "react-icons/fa6";

const REPO = "https://github.com/JulianNymark/rstudiowithtensorflow";
const RUN_CMD = "nix run github:JulianNymark/rstudiowithtensorflow";

function App() {
  return (
    <div className="container">
      <div className="bg-flora" aria-hidden>
        {["tl","tr","tr2","ml","mr","mr2","bl","br","tl2","t3","t4","m3","m4","b3","b4","t5","m5","b5"].map((pos) => (
          <PiPlantFill key={pos} className={`bg-leaf ${pos}`} />
        ))}
      </div>
      <Hero />
      <Requirements />
      <Card2>
        <Steps />
      </Card2>
      <Card2 id="windows">
        <WindowsCard />
      </Card2>
      <Card2>
        <Troubleshooting />
      </Card2>
      <Card2>
        <Tinker />
      </Card2>
      <Card2>
        <DeepDive />
      </Card2>
      <Footer />
    </div>
  );
}

export default App;

function Card2({ children, id }) {
  return (
    <Card id={id} className="card" style={{ padding: "24px 32px" }}>
      {children}
    </Card>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero-title-row">
        <div className="hero-monkey">
          <GiMonkey aria-hidden size={64} />
        </div>
        <Heading level={1} data-size="xl">
          RStudio + TensorFlow, one command.
          <div className="accent">No factory reset required.</div>
        </Heading>
      </div>

      <Paragraph variant="long" style={{ color: "var(--ds-color-neutral-text-subtle)" }}>
        If RStudio can't find TensorFlow, the fix is not deleting your PC.
        Three commands, done forever.
      </Paragraph>
    </div>
  );
}

function Requirements() {
  const rows = [
    {
      icon: <MonitorIcon aria-hidden />,
      label: "Operating system",
      value: (
        <>
          Linux, macOS, or Windows 11 (Windows needs WSL2 — a built-in way to
          run Linux inside Windows, <Link href="#windows">see below</Link>)
        </>
      ),
    },
    {
      icon: <FloppydiskIcon aria-hidden />,
      label: "Disk space",
      value: "~8 GB free (Nix tools ~6 GB + TensorFlow ~1 GB)",
    },
    {
      icon: <ClockIcon aria-hidden />,
      label: "Time",
      value:
        "~15 min of your attention + one long unattended wait on first install " +
        "(downloads & builds run by themselves — coffee time, not clicking time)",
    },
  ];
  return (
    <Card2>
      <Heading level={2} data-size="md" style={{ marginBottom: 16 }}>
        Before you start — you need
      </Heading>
      {rows.map((r) => (
        <div className="req-row" key={r.label}>
          <div className="req-icon">{r.icon}</div>
          <div className="req-label">
            <Label data-size="sm">{r.label}</Label>
          </div>
          <div className="req-value">
            <Paragraph data-size="sm" variant="long">
              {r.value}
            </Paragraph>
          </div>
        </div>
      ))}
    </Card2>
  );
}

function Step({ n, title, children }) {
  return (
    <div className="row">
      <div className="step-num">{n}</div>
      <div className="step-body">
        <Heading level={3} data-size="sm">
          {title}
        </Heading>
        <div style={{ marginTop: 8 }}>{children}</div>
      </div>
    </div>
  );
}

function Steps() {
  return (
    <>
      <Heading level={2} data-size="md">
        The setup (Linux and macOS)
      </Heading>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 40, marginTop: 16 }}>
        <Step n="1" title="Install Nix — one time, ~5 minutes">
          <Paragraph variant="long">
            Nix is a tool that installs software in isolated, reproducible
            packages — think "app store where every version always works".
          </Paragraph>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            <div className="os-pick" style={{ borderRadius: "var(--ds-border-radius-md)", border: "1px solid rgba(110,180,130,0.3)", padding: "14px 16px", background: "#131f17" }}>
              <Label data-size="sm" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaApple aria-hidden /> I'm on macOS
              </Label>
              <Paragraph data-size="sm" variant="long" style={{ marginTop: 6 }}>
                Download the{" "}
                <Link href="https://determinate.systems/install/" target="_blank" rel="noreferrer">
                  Determinate installer
                </Link>{" "}
                (a normal <code>.pkg</code> file), double-click it, click Continue
                until it's done. No terminal needed.
              </Paragraph>
            </div>
            <div className="os-pick" style={{ borderRadius: "var(--ds-border-radius-md)", border: "1px solid rgba(110,180,130,0.3)", padding: "14px 16px", background: "#131f17" }}>
              <Label data-size="sm" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TerminalIcon aria-hidden /> I'm on Linux (or WSL)
              </Label>
              <Paragraph data-size="sm" variant="long" style={{ marginTop: 6 }}>
                One line, type your password, press Enter once:
              </Paragraph>
              <CodeBlock
                label="terminal"
                code={`curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install`}
              />
            </div>
          </div>
          <Paragraph data-size="sm" variant="long" style={{ color: "var(--ds-color-neutral-text-subtle)" }}>
            Pick exactly <strong>one</strong> — they're different installers for
            different operating systems. Windows user? Do the WSL2 step first
            (below), then follow the Linux path <em>inside</em> WSL.
          </Paragraph>
          <Paragraph data-size="sm" variant="long" style={{ color: "var(--ds-color-neutral-text-subtle)" }}>
            When it finishes, close and reopen your terminal so the{" "}
            <code>nix</code> command is found.
          </Paragraph>
        </Step>

        <Step n="2" title="Run the one command">
          <CodeBlock label="terminal" code={RUN_CMD} />
          <Paragraph variant="long">
            <strong>Now walk away for a while.</strong> The first run downloads
            R, RStudio, and Python (~4 GB) and may compile some things —
            anywhere from 10 minutes to an hour depending on your machine and
            internet. That's normal, and it happens exactly once. When it's
            done, RStudio opens by itself, already wired to the right Python
            and TensorFlow.
          </Paragraph>
          <Alert data-color="info">
            <strong>Slow laptop? Use a power outlet.</strong> On battery,
            laptops slow down to save power and the one-time build takes much
            longer. Plugged in, it's the fastest your machine can go.
          </Alert>
        </Step>

        <Step n="3" title="Verify in RStudio's console (bottom-left pane)">
          <CodeBlock label="R console" code={"library(tensorflow)\ntf_config()"} />
          <div className="tinker-row">
            <div className="tinker-icon">
              <CheckmarkCircleIcon color="var(--ds-color-success-text-default)" title="Success" />
            </div>
            <Paragraph variant="long">
              You should see the TensorFlow version and the Python it found —
              pointing inside your user cache folder. Done.
            </Paragraph>
          </div>
        </Step>
      </div>
      <Paragraph data-size="sm" variant="long" style={{ color: "var(--ds-color-neutral-text-subtle)", marginTop: 24 }}>
        Next time: same command, opens in seconds. Prefer hacking in a
        terminal? Clone the repo, <code>cd</code> in, <code>nix develop</code>,{" "}
        <code>rstudio</code> — that also gives you <code>Rscript</code>.
      </Paragraph>
    </>
  );
}

function WindowsCard() {
  return (
    <>
      <Heading level={2} data-size="md">
        Windows 11 users: one extra step first
      </Heading>
      <Paragraph variant="long">
        This setup needs Linux. Windows has <strong>WSL2</strong> built in —
        think of it as a quiet, real Linux living inside Windows. You install
        it once, and afterwards RStudio opens as a normal window.
      </Paragraph>
      <CodeBlock label="PowerShell (as Administrator)" code={"wsl --install"} />
      <Paragraph data-size="sm" variant="long" style={{ color: "var(--ds-color-neutral-text-subtle)" }}>
        Reboot when asked. An Ubuntu terminal opens — in it, run the Linux Nix
        installer from step 1, then continue with step 2 inside that Ubuntu
        terminal. (Windows 10 users: WSLg isn't available, so we recommend
        updating to Windows 11 first.)
      </Paragraph>
    </>
  );
}

function Troubleshooting() {
  const rows = [
    {
      symptom: "The one command fails with an error about an R package not building",
      fix: (
        <>
          Use the fallback shell instead: <code>nix develop .#minimal</code>{" "}
          inside a cloned copy of the repo — then inside R:{" "}
          <code>install.packages(c("tensorflow","keras3"))</code>.
        </>
      ),
    },
    {
      symptom: "RStudio opens but tf_config() finds no TensorFlow",
      fix: (
        <>
          You opened a regular RStudio from your app menu. Use{" "}
          <code>nix run github:JulianNymark/rstudiowithtensorflow</code>{" "}
          instead — it launches RStudio with everything wired.
        </>
      ),
    },
    {
      symptom: "Anything else weird",
      fix: (
        <>
          Clean slate: <code>rm -rf ~/.cache/rstudiowithtensorflow</code>, run
          the command again. Still stuck?{" "}
          <Link href={`${REPO}/issues`}>Open an issue</Link> and paste the
          error — usually a one-line fix.
        </>
      ),
    },
  ];
  return (
    <>
      <Heading level={2} data-size="md">
        It didn't work?
      </Heading>
      <div style={{ marginTop: 8 }}>
        {rows.map((r) => (
          <Details key={r.symptom}>
            <Details.Summary>{r.symptom}</Details.Summary>
            <Details.Content>
              <Paragraph data-size="sm" variant="long">
                {r.fix}
              </Paragraph>
            </Details.Content>
          </Details>
        ))}
      </div>
    </>
  );
}

function Tinker() {
  return (
    <>
      <Heading level={2} data-size="md">
        "Can I break my computer? Can I add packages?"
      </Heading>
      <Alert data-color="success">
        <strong>Short answer: you can't break anything permanently.</strong>{" "}
        Everything this setup installs lives in two folders: the Nix store
        (read-only, managed automatically) and{" "}
        <code>~/.cache/rstudiowithtensorflow</code>. RStudio can crash, you can
        delete a package, you can misconfigure something — the fix is always
        the same and always works:{" "}
        <code>rm -rf ~/.cache/rstudiowithtensorflow</code> and run the command
        again. You get a factory-fresh, known-good setup in minutes. That's
        the whole point of using Nix.
      </Alert>
      <div className="tinker-row">
        <div className="tinker-icon">
          <WrenchIcon aria-hidden />
        </div>
        <Paragraph variant="long">
          <strong>Add a Python package</strong> (e.g. <code>scikit-learn</code>):
          open{" "}
          <Link href={`${REPO}/blob/main/requirements.txt`} target="_blank" rel="noreferrer">
            requirements.txt
          </Link>{" "}
          in the repo, add its name on a line, then delete the cache folder and
          run the command again.
        </Paragraph>
      </div>
      <div className="tinker-row">
        <div className="tinker-icon">
          <WrenchIcon aria-hidden />
        </div>
        <Paragraph variant="long">
          <strong>Add an R package</strong>: safest inside RStudio —{" "}
          <code>install.packages("ggplot2")</code>. It goes into your home
          folder, not the Nix store, and survives everything.
        </Paragraph>
      </div>
      <div className="tinker-row">
        <div className="tinker-icon">
          <TrashIcon aria-hidden />
        </div>
        <Paragraph variant="long">
          <strong>Uninstall everything</strong>: delete{" "}
          <code>~/.cache/rstudiowithtensorflow</code>, then{" "}
          <code>/nix/nix-installer uninstall</code>. Your system is exactly as
          before — nothing was ever written outside those paths.
        </Paragraph>
      </div>
      <Paragraph data-size="sm" variant="long" style={{ color: "var(--ds-color-neutral-text-subtle)", marginTop: 16 }}>
        What this setup <em>doesn't</em> touch: your existing Python, R, or
        Anaconda installs. Nix packages live in <code>/nix/store</code> with
        their own libraries and never conflict with anything you already have —
        that's why the old TensorFlow problem can't come back.
      </Paragraph>
    </>
  );
}

function DeepDive() {
  return (
    <>
      <Details>
        <Details.Summary>
          Why does RStudio keep losing TensorFlow? (the honest explanation)
        </Details.Summary>
        <Details.Content>
          <Paragraph variant="long">
            RStudio is just the editor. The language inside it is{" "}
            <strong>R</strong>. TensorFlow has no native R version — the R
            package called <code>tensorflow</code> is a thin wrapper that calls
            the <strong>Python</strong> TensorFlow through a bridge package
            named <code>reticulate</code>. Chain:
          </Paragraph>
          <CodeBlock
            label="what happens under the hood"
            code={"R (library(tensorflow))  ->  reticulate  ->  some Python  ->  TensorFlow"}
          />
          <Paragraph variant="long">
            The fragile link is "some Python". Reticulate has to guess which
            one to use — system Python, conda, a venv, a half-removed
            Anaconda… If it guesses one without TensorFlow, you get the wall
            of errors. Reinstalling or wiping the machine doesn't help because
            the next guess can be wrong the same way.
          </Paragraph>
          <Paragraph variant="long">
            <strong>The fix:</strong> stop guessing. One pinned Python with
            TensorFlow in it, and an environment variable that hard-wires R to
            it. That's exactly what the flake does — plus R, RStudio, and every
            package are pinned too, so the setup reproduces identically from
            zero on any machine.
          </Paragraph>
        </Details.Content>
      </Details>
      <Details>
        <Details.Summary>How it works under the hood (optional)</Details.Summary>
        <Details.Content>
          <Paragraph variant="long">
            On first run, a <code>uv</code> venv is created in{" "}
            <code>~/.cache/rstudiowithtensorflow/venv</code> and{" "}
            <code>RETICULATE_PYTHON</code> is exported pointing at it.
            Reticulate then has exactly one Python to pick — the right one,
            always.
          </Paragraph>
          <Paragraph data-size="sm" variant="long" style={{ color: "var(--ds-color-neutral-text-subtle)" }}>
            Why wheels instead of Nix's own TensorFlow package? nixpkgs' Python
            TensorFlow build is broken upstream (dependency EOL), and official
            PyPI wheels are the one source that reliably covers Linux and
            Apple Silicon. Version mismatch between the R and Python sides?
            Pin the exact version in <code>requirements.txt</code>, delete the
            cache folder, rerun.
          </Paragraph>
        </Details.Content>
      </Details>
    </>
  );
}

function Footer() {
  return (
    <footer className="page-footer">
      <Paragraph data-size="sm">
        Source: <Link href={REPO}>{REPO.replace("https://", "")}</Link> · MIT license
      </Paragraph>
    </footer>
  );
}

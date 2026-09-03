import { useState } from "react";
import { FilesIcon, CheckmarkIcon } from "@navikt/aksel-icons";

const KEYWORDS =
  /\b(nix|curl|sh|git|cd|rm|rf|exec|if|then|fi|export|source|install|library|print|tensorflow|keras3|install\.packages|tf_config|nix-shell|wsl|reboot|Rscript)\b/;

/* Tiny regex highlighter: comments, strings, numbers, known keywords.
   Order matters: comment → string → number → keyword. */
function tokenize(line) {
  const tokens = [];
  let rest = line;
  while (rest.length > 0) {
    let m;
    if ((m = rest.match(/^#.*$/))) {
      tokens.push({ cls: "cmt", text: m[0] });
      rest = "";
    } else if ((m = rest.match(/^"[^"]*"/))) {
      tokens.push({ cls: "str", text: m[0] });
    } else if ((m = rest.match(/^\d[\d.]*/))) {
      tokens.push({ cls: "num", text: m[0] });
    } else if ((m = rest.match(/^[A-Za-z_][\w.]*/))) {
      tokens.push({ cls: KEYWORDS.test(m[0]) ? "kwd" : null, text: m[0] });
    } else {
      m = rest.match(/^[^"\w#]+/);
      tokens.push({ cls: null, text: m[0] });
    }
    rest = rest.slice(m[0].length);
  }
  return tokens;
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy-btn"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? (
        <CheckmarkIcon aria-hidden />
      ) : (
        <FilesIcon aria-hidden title="Copy" />
      )}
    </button>
  );
}

/* Home-brewed block: editor-chrome header (label + copy) above the code,
   the pattern GitHub and most docs sites use. */
export default function CodeBlock({ code, copyText, label }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div className="codeblock">
      <div className="codeblock-header">
        <span className="codeblock-label">{label}</span>
        <CopyBtn text={copyText ?? code} />
      </div>
      <pre>
        <code>
          {lines.map((line, i) => (
            <div key={i} className="codeline">
              {tokenize(line).map((t, j) =>
                t.cls ? (
                  <span key={j} className={`token ${t.cls}`}>
                    {t.text}
                  </span>
                ) : (
                  <span key={j}>{t.text}</span>
                )
              )}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

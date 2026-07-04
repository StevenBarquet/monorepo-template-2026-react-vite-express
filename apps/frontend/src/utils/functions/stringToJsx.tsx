import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { type Indexable } from 'src/utils/typeUtils';

export interface ReactDictionary {
  [s: Indexable]: ReactNode;
}
/** Remplaza texto con formato de template string con componentes de react
 * @example
 * const originalText= "Some text targeted to ${audience} in ${count}"
 * const newText= reactTemplatesReplacer(originalText, {audience: <strong>Students</strong>, count: <span style={{color: 'green'}}>25 states</span> }); // <>Some text targeted to <strong>Students</strong> <span style={{color: 'green'}}>25 states</span></>
 */
export function reactTemplatesReplacer(originalText: string, templates: ReactDictionary) {
  const regex = /\$\{([^\}]+)\}/g;
  const parts = originalText.split(regex);
  const nodes = parts.map((part) => {
    if (part in templates) {
      return templates[part];
    } else {
      return part;
    }
  });
  return <>{nodes}</>;
}

type MarkupJsxProps = {
  /** hrefs para los Link (react router), se inyectan en orden de aparición en el texto */
  to?: string[];
  /** Props de tag anchor (<a></a>), se inyectan en orden de aparición en el texto */
  anchorProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>[];
  /** Máximo nivel de anidación permitido (1 = hijos directos con texto o inline) */
  maxDepth?: number;
  /** Permite restringir tags. Si no se indica, se permiten todos los soportados. */
  allowTags?: Partial<Record<AllowedTag, true>>;
};

type AllowedTag =
  | 'div'
  | 'p'
  | 'span'
  | 'b'
  | 'strong'
  | 'i'
  | 'em'
  | 'u'
  | 'br'
  | 'Link'
  | 'Anchor';

const DEFAULT_ALLOWED: Record<AllowedTag, true> = {
  div: true,
  p: true,
  span: true,
  b: true,
  strong: true,
  i: true,
  em: true,
  u: true,
  br: true,
  Link: true,
  Anchor: true,
};

const SELF_CLOSING = new Set<AllowedTag>(['br']);

type TextToken = { type: 'text'; value: string };
type TagToken = {
  type: 'tag';
  name: string;
  isClosing: boolean;
  isSelfClosing: boolean;
  raw: string;
};
type Token = TextToken | TagToken;

type NodeText = { kind: 'text'; value: string };
type NodeElement = {
  kind: 'element';
  name: AllowedTag | '#root';
  children: Node[];
  raw?: string; // útil si queremos conservar literal en errores
};
type Node = NodeText | NodeElement;

function tokenize(input: string, allowed: Record<AllowedTag, true>): Token[] {
  const TAG_RE = /<(\/)?\s*([A-Za-z][\w-]*)[^>]*?(\/)?>/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = TAG_RE.exec(input)) !== null) {
    // texto previo
    if (m.index > lastIndex) {
      tokens.push({ type: 'text', value: input.slice(lastIndex, m.index) });
    }
    const raw = m[0];
    const isClosing = !!m[1];
    const name = m[2] as string;
    const isSelfClosing = !!m[3];

    // Aceptar solo tags permitidos (case-sensitive)
    if (!Object.prototype.hasOwnProperty.call(allowed, name)) {
      // No permitido: tratar como texto literal
      tokens.push({ type: 'text', value: raw });
    } else {
      tokens.push({
        type: 'tag',
        name,
        isClosing,
        isSelfClosing: isSelfClosing || SELF_CLOSING.has(name as AllowedTag),
        raw,
      });
    }
    lastIndex = TAG_RE.lastIndex;
  }
  if (lastIndex < input.length) {
    tokens.push({ type: 'text', value: input.slice(lastIndex) });
  }
  return tokens;
}

function parse(tokens: Token[], maxDepth: number): NodeElement {
  const root: NodeElement = { kind: 'element', name: '#root', children: [] };
  const stack: NodeElement[] = [root];
  let depth = 0;

  const pushText = (text: string) => {
    if (!text) return;
    stack[stack.length - 1].children.push({ kind: 'text', value: text });
  };

  for (const t of tokens) {
    if (t.type === 'text') {
      pushText(t.value);
      continue;
    }

    const name = t.name as AllowedTag;
    if (t.isClosing) {
      // Cierre correcto solo si coincide con el top
      const top = stack[stack.length - 1];
      if (top && top.name === name) {
        stack.pop();
        depth = Math.max(0, depth - 1);
      } else {
        // Mismatch: conservar literal
        pushText(t.raw);
      }
      continue;
    }

    // Apertura o self-closing
    if (t.isSelfClosing) {
      stack[stack.length - 1].children.push({
        kind: 'element',
        name,
        children: [],
      });
      continue;
    }

    // Apertura normal
    if (depth + 1 > maxDepth) {
      // Supera la profundidad: conservar literal
      pushText(t.raw);
      continue;
    }

    const el: NodeElement = { kind: 'element', name, children: [] };
    stack[stack.length - 1].children.push(el);
    stack.push(el);
    depth += 1;
  }

  // Si quedaron tags sin cerrar, los dejamos tal cual (contenido ya quedó en árbol)
  return root;
}

function renderNode(
  node: Node,
  ctx: {
    to: string[];
    anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement>[];
    linkIndex: number;
    anchorIndex: number;
    keyPrefix: string;
  },
  key: React.Key
): React.ReactNode {
  if (node.kind === 'text') return node.value;

  // Render hijos
  const children = node.children.map((child, i) =>
    renderNode(child, ctx, `${key}-${i}`)
  );

  switch (node.name) {
    case '#root':
      return <>{children}</>;
    case 'div':
      return <div key={key}>{children}</div>;
    case 'p':
      return <p key={key}>{children}</p>;
    case 'span':
      return <span key={key}>{children}</span>;
    case 'b':
      return <b key={key}>{children}</b>;
    case 'strong':
      return <strong key={key}>{children}</strong>;
    case 'i':
      return <i key={key}>{children}</i>;
    case 'em':
      return <em key={key}>{children}</em>;
    case 'u':
      return <u key={key}>{children}</u>;
    case 'br':
      return <br key={key} />;
    case 'Link': {
      const href = ctx.to[ctx.linkIndex] ?? '#';
      ctx.linkIndex += 1;
      return (
        <Link key={key} to={href}>
          {children}
        </Link>
      );
    }
    case 'Anchor': {
      const props = ctx.anchorProps[ctx.anchorIndex] ?? {};
      ctx.anchorIndex += 1;
      return (
        <a key={key} {...props}>
          {children}
        </a>
      );
    }
    default:
      // No debería ocurrir (whitelist), pero por seguridad devolvemos hijos.
      return <Fragment key={key}>{children}</Fragment>;
  }
}

/**
 * Convierte una cadena con tags whitelisteados en JSX.
 * Soporta 1 nivel de anidación por defecto y mapea <Link> y <Anchor> a sus componentes.
 *
 * Ejemplos soportados:
 * - <p>Hola <b>mundo</b></p>
 * - <div>Texto <Anchor>externo</Anchor> y <Link>interno</Link><br/>nueva línea</div>
 */
export function stringToJsx(
  originalText: string,
  options?: MarkupJsxProps
): React.ReactNode {
  const to = options?.to ?? [];
  const anchorProps = options?.anchorProps ?? [];
  const maxDepth = Math.max(0, options?.maxDepth ?? 1);

  const allowed = options?.allowTags
    ? (Object.keys(DEFAULT_ALLOWED) as AllowedTag[]).reduce(
        (acc, k) => {
          if (options.allowTags?.[k]) acc[k] = true;
          return acc;
        },
        {} as Record<AllowedTag, true>
      )
    : DEFAULT_ALLOWED;

  const tokens = tokenize(originalText, allowed);
  const ast = parse(tokens, maxDepth);

  const ctx = {
    to,
    anchorProps,
    linkIndex: 0,
    anchorIndex: 0,
    keyPrefix: 'mk',
  };

  return renderNode(ast, ctx, ctx.keyPrefix);
}

// Notas:
// - Seguridad: solo se renderizan tags whitelisteados; el resto va como texto. No se evalúan atributos arbitrarios ni HTML sin control.
// - Si necesitas más tags, añádelos en AllowedTag, DEFAULT_ALLOWED y en el switch de renderNode.
// - Puedes ajustar maxDepth si quieres permitir más anidación.
// - El parser tolera cierres desordenados o faltantes sin romper la renderización (deja el literal).
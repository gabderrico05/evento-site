# Componente ParticipanteDados - Proteção XSS

## 📋 Visão Geral

O componente `ParticipanteDados` foi desenvolvido para exibir informações do participante (nome, email e número do ingresso) com **proteção automática contra ataques XSS (Cross-Site Scripting)**.

## 🔒 Proteção XSS Implementada

### 1. **Escaping Automático do React**

O React automaticamente escapa todos os valores renderizados em JSX, convertendo caracteres especiais HTML em entidades seguras:

```jsx
// Se o nome for: <script>alert('XSS')</script>
<p>{nome}</p>
// Será renderizado como texto: &lt;script&gt;alert('XSS')&lt;/script&gt;
// E NÃO será executado como código JavaScript
```

### 2. **Conversão Explícita para String**

```jsx
const nomeSeguro = String(nome || '').trim()
const emailSeguro = String(email || '').trim()
const numeroIngressoSeguro = String(numeroIngresso || '').trim()
```

Isso garante que:
- Valores não-string sejam convertidos para string
- Espaços extras sejam removidos
- Valores nulos/undefined sejam tratados

### 3. **Validação de Props com PropTypes**

```jsx
ParticipanteDados.propTypes = {
  nome: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  numeroIngresso: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
}
```

## 🚀 Como Usar

### Instalação de Dependências

```bash
npm install lucide-react prop-types
```

### Uso Básico

```jsx
import ParticipanteDados from '@/components/ParticipanteDados'

function MeuComponente() {
  return (
    <ParticipanteDados
      nome="João Silva"
      email="joao@example.com"
      numeroIngresso="ABC123456"
    />
  )
}
```

### Uso com Dados da API

```jsx
import { useState, useEffect } from 'react'
import ParticipanteDados from '@/components/ParticipanteDados'

function IngressoPage() {
  const [participante, setParticipante] = useState(null)

  useEffect(() => {
    // Buscar dados da API
    fetch('/api/participante/123')
      .then(res => res.json())
      .then(data => setParticipante(data))
  }, [])

  if (!participante) return <div>Carregando...</div>

  return (
    <ParticipanteDados
      nome={participante.nome}
      email={participante.email}
      numeroIngresso={participante.numeroIngresso}
    />
  )
}
```

### Uso com localStorage

```jsx
import { useState, useEffect } from 'react'
import ParticipanteDados from '@/components/ParticipanteDados'

function MeuIngresso() {
  const [participante, setParticipante] = useState(null)

  useEffect(() => {
    const dados = localStorage.getItem('participante')
    if (dados) {
      setParticipante(JSON.parse(dados))
    }
  }, [])

  if (!participante) return null

  return (
    <ParticipanteDados
      nome={participante.nome}
      email={participante.email}
      numeroIngresso={participante.numeroIngresso}
    />
  )
}
```

## ⚠️ O Que NÃO Fazer

### ❌ NUNCA use dangerouslySetInnerHTML

```jsx
// PERIGOSO - NÃO FAÇA ISSO!
<div dangerouslySetInnerHTML={{ __html: nome }} />
```

### ❌ NUNCA insira HTML diretamente

```jsx
// PERIGOSO - NÃO FAÇA ISSO!
<div innerHTML={email}></div>
```

### ❌ NUNCA use eval() ou Function()

```jsx
// PERIGOSO - NÃO FAÇA ISSO!
eval(participanteData)
new Function(participanteData)()
```

## ✅ Boas Práticas

### 1. **Sempre use JSX para renderizar dados**

```jsx
// ✅ CORRETO
<p>{nome}</p>

// ❌ INCORRETO
<p dangerouslySetInnerHTML={{ __html: nome }} />
```

### 2. **Valide tipos de dados**

```jsx
const nomeSeguro = String(nome || '').trim()
```

### 3. **Use PropTypes ou TypeScript**

```jsx
import PropTypes from 'prop-types'

ParticipanteDados.propTypes = {
  nome: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  numeroIngresso: PropTypes.string.isRequired
}
```

### 4. **Sanitize dados do backend quando necessário**

Se precisar renderizar HTML rico (markdown, etc), use bibliotecas confiáveis:

```bash
npm install dompurify
```

```jsx
import DOMPurify from 'dompurify'

// Apenas se REALMENTE precisar renderizar HTML
const conteudoLimpo = DOMPurify.sanitize(conteudoHTML)
<div dangerouslySetInnerHTML={{ __html: conteudoLimpo }} />
```

## 🧪 Testando a Proteção XSS

### Teste 1: Script Injection

```jsx
<ParticipanteDados
  nome="<script>alert('XSS')</script>"
  email="test@example.com"
  numeroIngresso="123"
/>
// Resultado: O script é exibido como texto, não executado
```

### Teste 2: HTML Injection

```jsx
<ParticipanteDados
  nome="<img src=x onerror=alert('XSS')>"
  email="<b>Bold Email</b>"
  numeroIngresso="<h1>Big Number</h1>"
/>
// Resultado: Tags HTML são escapadas e exibidas como texto
```

### Teste 3: Event Handler Injection

```jsx
<ParticipanteDados
  nome="Nome\" onclick=\"alert('XSS')\""
  email="test@example.com"
  numeroIngresso="123"
/>
// Resultado: O atributo onclick não é executado
```

## 📊 Como o React Previne XSS

O React escapa automaticamente caracteres especiais:

| Caractere | Versão Escapada | Descrição |
|-----------|----------------|-----------|
| `<` | `&lt;` | Menor que |
| `>` | `&gt;` | Maior que |
| `"` | `&quot;` | Aspas duplas |
| `'` | `&#x27;` | Aspas simples |
| `&` | `&amp;` | E comercial |

Exemplo:
```jsx
const nome = "<script>alert('XSS')</script>"
<p>{nome}</p>
// Renderizado no HTML como:
// <p>&lt;script&gt;alert('XSS')&lt;/script&gt;</p>
```

## 🔐 Recursos Adicionais de Segurança

### Content Security Policy (CSP)

Adicione ao `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

### Validação no Backend

Sempre valide e sanitize dados no backend:

```python
# Exemplo em Python/FastAPI
from fastapi import HTTPException
import re

def validar_nome(nome: str) -> str:
    # Remover caracteres especiais
    nome_limpo = re.sub(r'[<>\"\'&]', '', nome)
    if len(nome_limpo) < 2:
        raise HTTPException(400, "Nome inválido")
    return nome_limpo
```

## 📚 Referências

- [React Documentation - JSX Prevents Injection Attacks](https://react.dev/learn/writing-markup-with-jsx#jsx-prevents-injection-attacks)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify - HTML Sanitizer](https://github.com/cure53/DOMPurify)

## 🎯 Conclusão

O componente `ParticipanteDados` implementa as melhores práticas de segurança:

✅ Escaping automático do React  
✅ Validação de tipos com PropTypes  
✅ Conversão explícita para string  
✅ Sem uso de dangerouslySetInnerHTML  
✅ Interface clara e documentada  

**Resultado:** Proteção robusta contra ataques XSS sem necessidade de bibliotecas externas.

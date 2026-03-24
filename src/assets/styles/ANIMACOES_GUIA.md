# 🎬 Guia de Animações e UX - Impacta

## 📋 Resumo das Mudanças

Um novo sistema de animações foi implementado com foco em **UX responsiva**. As principais mudanças:

- ✅ Animações **apenas** em elementos clicáveis (botões, links, cards)
- ✅ Nenhum movimento em elementos não-clicáveis (textos, ícones estáticos)
- ✅ Uso de cubic-bezier smoother para animações profissionais
- ✅ Efeitos de elevação com shadows em vez de só transform

## 📂 Arquivos Criados/Modificados

### Novos Arquivos:
- `src/assets/styles/animations.css` - Keyframes reutilizáveis e classes de animação
- `src/assets/styles/animations-guide.css` - Documentação de boas práticas (não é importado)

### Arquivos Modificados:
- `src/assets/styles/index.css` - Importa animations.css
- `src/views/components/btn-primary.css` - Animações de botão primário
- `src/views/components/btn-secondary.css` - Animações de botão secundário
- `src/views/components/Header.css` - Links com underline animado
- `src/views/components/ServiceCard.css` - Card com elevação e scale do ícone
- `src/views/components/card.css` - Card base melhorado
- `src/views/components/Footer.css` - Links sociais com animação
- `src/views/components/CTA.css` - Animações de entrada
- `src/views/components/UserMenu.css` - Menu com scale do ícone
- `src/views/pages/Home.css` - Animações de entrada do herói
- `src/views/pages/Login.css` - Animações de entrada
- `src/views/pages/Cadastro.css` - Animações de entrada
- `src/views/pages/Sobre.css` - Animações de entrada
- `src/views/pages/Perfil.css` - Animações de entrada

## 🎨 Padrões de Animação por Tipo

### 1. **Botões** (Clicáveis)
```css
.button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.button:hover {
  transform: translateY(-2px); ✅ ELEVAÇÃO
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25); ✅ SOMBRA AUMENTA
}

.button:active {
  transform: translateY(0); ✅ VOLTA AO NORMAL
}
```

### 2. **Links de Navegação** (Clicáveis)
```css
.nav-link::after {
  width: 0;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%; ✅ UNDERLINE ANIMADO (SEM MOVIMENTO)
}
```

### 3. **Ícones em Cards** (NÃO clicáveis isolados)
```css
/* ❌ ERRADO: */
.icon:hover {
  transform: scale(1.2); /* Move o layout! */
}

/* ✅ CORRETO: */
.icon {
  transition: color 0.3s ease;
}

.icon:hover {
  color: var(--laranja-vibrante); /* Apenas cor */
}

/* EXCEÇÃO: Ícone dentro de card clicável pode ter scale */
.service-card:hover .service-icon {
  transform: scale(1.08); ✅ OK - Card é interativo
}
```

### 4. **Cards/Containers** (Clicáveis de forma geral)
```css
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-6px); ✅ ELEVAÇÃO
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2); ✅ SOMBRA
}
```

## 🚀 Usando Animações em Novos Componentes

### Para Animações de Entrada (na montagem):
```css
.component {
  animation: slideInUp 0.8s ease-out forwards;
  /* ou: slideInDown, fadeIn, scaleIn */
}

.component-delayed {
  animation: slideInUp 0.8s ease-out 0.2s forwards;
  opacity: 0; /* Necessário para aparecer após delay */
}
```

### Para Hover em Clicáveis:
```css
.interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 195, 0, 0.3);
}
```

### Para Elementos Não-Clicáveis:
```css
.static-text {
  /* NÃO use transform! */
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.static-text:hover {
  color: var(--laranja-vibrante); /* Apenas cor */
}
```

## 🎯 Keyframes Disponíveis

Todos em `animations.css`:

- `slideInUp` - Entra de baixo para cima
- `slideInDown` - Entra de cima para baixo
- `slideDown` - Dropdown animation
- `fadeIn` - Fade smooth
- `scaleIn` - Escala + fade
- `underlineExpand` - Underline que expande
- `pulse` - Pulso de sombra
- `glow` - Brilho suave
- `softBounce` - Bounce leve
- `spin` - Rotação (para loading)
- `shimmer` - Efeito de brilho (skeleton)

## ⏱️ Timings Recomendados

| Tipo | Duração | Easing |
|------|---------|--------|
| Hover/Focus | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |
| Entrada | 0.6-0.8s | ease-out |
| Saída | 0.3s | ease-in |
| Delays (entrées) | 0.2s, 0.4s | - |

## 🔍 Checklist para Adicionar Animações

- [ ] É um elemento **clicável**? Se não, use apenas `color`, `background-color`, `text-shadow`
- [ ] Usar `cubic-bezier(0.4, 0, 0.2, 1)` para smooth profissional
- [ ] Adicionar `box-shadow` junto com `transform` para melhor visual
- [ ] Testar com `prefers-reduced-motion` (acessibilidade)
- [ ] Manter delays < 0.5s para hover (só usar delays em entrada)
- [ ] Nunca animar `width`, `height`, `padding`, `margin` diretamente
- [ ] Usar `transform` e `opacity` para performance

## 🌐 Acessibilidade

O projeto respeita `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Usuários que preferem menos movimento terão animações removidas automaticamente.

## 📝 Exemplos Práticos

### ✅ Botão Correto
```jsx
// JSX
<button className="btn-primary">
  Enviar
</button>
```

```css
/* CSS - animations.css + btn-primary.css */
.btn-primary {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 195, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 195, 0, 0.4);
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 195, 0, 0.2), 
              0 8px 25px rgba(255, 195, 0, 0.4);
}
```

### ✅ Link Correto
```jsx
<Link to="/page" className="nav-link">
  Menu
</Link>
```

```css
.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

### ❌ Ícone Incorreto
```css
/* NÃO FAZER */
.icon:hover {
  transform: scale(1.2); /* Move outros elementos! */
}

/* FAZER */
.icon:hover {
  color: var(--laranja-vibrante); /* Apenas cor */
}
```

## 🧪 Testando Animações

Abra DevTools (F12) e:

1. Elements → Animations panel
2. Passe o mouse sobre botões e veja as animações
3. Teste com `prefers-reduced-motion` (DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion)
4. Verifique que textos e ícones NÃO se movem ao passar cursor

## 💡 Dúvidas Comuns

**P: Por que meu texto está se movendo?**
R: Você está usando `transform: scale()` ou similar em um elemento não-clicável. Use apenas `color` conforme o guia.

**P: A animação está muito lenta?**
R: Reduza de 0.8s para 0.6s ou de 0.4s para 0.3s. Máximo 0.5s em hover.

**P: Preciso de mais animações complexas?**
R: Use `@keyframes` em `animations.css` e importe seus componentes com `animation: nome 0.3s ease-out forwards;`

---

**Versão:** 1.0  
**Última atualização:** 24/03/2026

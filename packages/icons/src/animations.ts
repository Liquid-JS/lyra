/**
 * The icons' animation styles: the classes NbAnimatedSvgIcon gives an icon with an `animation` option, and
 * `nb-icons-parent-hover`, which plays a hover animation when its element is hovered. They stop for users who ask for
 * reduced motion.
 */
export const ANIMATION_STYLES = [
    '.nb-icons-animation{animation-duration:1s;animation-fill-mode:both}',
    '.nb-icons-infinite{animation-iteration-count:infinite}',
    '.nb-icons-animate-shake{animation-name:nb-icons-shake}',
    '.nb-icons-animate-zoom{animation-name:nb-icons-zoom-in}',
    '.nb-icons-animate-pulse{animation-name:nb-icons-pulse}',
    '.nb-icons-animate-flip{animation-name:nb-icons-flip-in-y}',
    '.nb-icons-hover{display:inline-block}',
    '.nb-icons-hover:hover .nb-icons-animate-hover-shake,.nb-icons-parent-hover:hover .nb-icons-animate-hover-shake{animation-name:nb-icons-shake}',
    '.nb-icons-hover:hover .nb-icons-animate-hover-zoom,.nb-icons-parent-hover:hover .nb-icons-animate-hover-zoom{animation-name:nb-icons-zoom-in}',
    '.nb-icons-hover:hover .nb-icons-animate-hover-pulse,.nb-icons-parent-hover:hover .nb-icons-animate-hover-pulse{animation-name:nb-icons-pulse}',
    '.nb-icons-hover:hover .nb-icons-animate-hover-flip,.nb-icons-parent-hover:hover .nb-icons-animate-hover-flip{animation-name:nb-icons-flip-in-y}',
    '@keyframes nb-icons-flip-in-y{from{transform:perspective(400px) rotate3d(0,1,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(0,1,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(0,1,0,-5deg)}to{transform:perspective(400px)}}',
    '@keyframes nb-icons-shake{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(-3px,0,0)}20%,40%,60%,80%{transform:translate3d(3px,0,0)}}',
    '@keyframes nb-icons-pulse{from{transform:scale3d(1,1,1)}50%{transform:scale3d(1.2,1.2,1.2)}to{transform:scale3d(1,1,1)}}',
    '@keyframes nb-icons-zoom-in{from{opacity:1;transform:scale3d(0.5,0.5,0.5)}50%{opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.nb-icons-animation{animation:none}}'
].join('')

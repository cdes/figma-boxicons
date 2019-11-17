import { jsx } from '@emotion/core';
import theme from '../theme';
import { memo } from 'react';
import { html as io } from '../io';

interface IconButtonProps {
  icon: {
    name: string;
    prefix: string;
    type: string;
  };
  version: string;
  style: object;
}

async function sendIcon(name, url) {
  const response = await fetch(url);
  const icon = await response.text();
  io.send('add-icon', { icon, name });
}

function IconButton({ icon, style, version }: IconButtonProps) {
  const { name, type, prefix } = icon;
  const url = `https://cdn.jsdelivr.net/npm/boxicons@${version}/svg/${type}/${name}`;
  const cls = name.replace('.svg', '');

  return (
    <button
      key={name}
      aria-label={name}
      onClick={() => sendIcon(name, url)}
      css={{
        padding: theme.space[2],
        color: '#333',
        background: 'transparent',
        border: 0,
        borderRadius: theme.radii[1],
        animation: 'fadeIn 200ms ease-in-out',
        appearance: 'none',
        fontSize: '24px',
        outline: 0,
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.06)',
        },
        '&:focus, &:active': {
          boxShadow: `inset 0 0 0 2px ${theme.colors.blue}`,
        },
        ...style,
      }}
    >
      <i className={`bx ${cls}`}></i>
    </button>
  );
}

export default memo(IconButton);

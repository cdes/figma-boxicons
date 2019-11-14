import { Global, jsx } from '@emotion/core';
import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import IconButton from './components/icon-button';
import SearchInput from './components/search-input';
import theme from './theme';
import './ui.css';
import useSearch from './use-search';
import IconsContext from './icons-context';
import { FixedSizeGrid as Grid } from 'react-window';

let version;

function getPrefix(name: string) {
  return name.replace(/-.+/, '');
}

function getAlias(name: string, type: string) {
  const prefix = getPrefix(name);
  const alias = name
    .replace(prefix, '')
    .replace(/-/g, ' ')
    .replace(/\.svg/, '');
  return `${alias} ${type} ${prefix}`;
}

function App() {
  const [query, setQuery] = useState(' ');
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState([]);

  useEffect(() => {
    (async () => {
      const packageResponse = await fetch(
        'https://data.jsdelivr.com/v1/package/npm/boxicons'
      );
      const packageJson = await packageResponse.json();

      version = packageJson.tags.latest;

      const response = await fetch(
        `https://data.jsdelivr.com/v1/package/npm/boxicons@${version}`
      );
      const files = await response.json();

      const icons = files.files.filter(dir => dir.name === 'svg')[0].files;
      const solid = icons
        .filter(dir => dir.name === 'solid')[0]
        .files.map(icon => ({
          name: icon.name,
          alias: getAlias(icon.name, 'solid'),
          type: 'solid',
          prefix: getPrefix(icon.name),
        }));
      const logos = icons
        .filter(dir => dir.name === 'logos')[0]
        .files.map(icon => ({
          name: icon.name,
          alias: getAlias(icon.name, 'logos'),
          type: 'logos',
          prefix: getPrefix(icon.name),
        }));
      const regular = icons
        .filter(dir => dir.name === 'regular')[0]
        .files.map(icon => ({
          name: icon.name,
          alias: getAlias(icon.name, 'regular'),
          type: 'regular',
          prefix: getPrefix(icon.name),
        }));

      const json = [...solid, ...logos, ...regular];

      setMeta(json);
      setLoading(false);
      setQuery('');
    })();
  }, []);

  const results = useSearch(query, meta);

  return (
    <IconsContext.Provider value={meta}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Global
            styles={{ body: { margin: 0, fontFamily: 'Inter, sans-serif' } }}
          />
          Loading
        </div>
      ) : (
        <React.Fragment>
          <Global
            styles={{ body: { margin: 0, fontFamily: 'Inter, sans-serif' } }}
          />
          <SearchInput
            value={query}
            onChange={event => setQuery(event.target.value)}
            css={{
              position: 'sticky',
              top: 0,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            }}
            count={meta.length}
          />
          <div css={{ padding: theme.space[2], paddingBottom: 0 }}>
            <Grid
              columnCount={5}
              rowCount={Math.round(results.length)}
              columnWidth={284 / 5}
              rowHeight={284 / 5}
              width={284}
              height={351}
            >
              {({ columnIndex, rowIndex, style }) => {
                const icon = results[rowIndex][columnIndex];
                return icon === undefined ? null : (
                  <IconButton icon={icon} style={style} version={version} />
                );
              }}
            </Grid>
          </div>
        </React.Fragment>
      )}
    </IconsContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

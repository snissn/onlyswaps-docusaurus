import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout title="Docs Versions" description="Compare OnlySwaps Docs versions">
      <main style={{padding: '4rem 1rem'}}>
        <div style={{maxWidth: 900, margin: '0 auto', textAlign: 'center'}}>
          <h1 style={{fontSize: '2.2rem', marginBottom: '0.5rem'}}>OnlySwaps Documentation</h1>
          <p style={{opacity: 0.8, marginBottom: '2rem'}}>
            Compare two alternative versions side by side.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link className="button button--primary button--lg" to="/v2">
              Open Docs v2
            </Link>
            <Link className="button button--secondary button--lg" to="/v1">
              Open Docs v1
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}


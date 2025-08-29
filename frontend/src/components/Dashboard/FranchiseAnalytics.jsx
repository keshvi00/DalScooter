import React from 'react';

const FranchiseAnalytics = () => {
  return (
    <div className="analytics-container" style={{ padding: '1rem' }}>
   
      <div className="iframe-wrapper" style={{ width: '100%', maxWidth: '100%', overflow: 'auto' }}>
        <iframe
          width="100%"
          height="600"
          src="https://lookerstudio.google.com/embed/reporting/9dcc7701-aed4-4634-8f60-ce27109c7e39/page/Z2kTF"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          title="LookerStudio Login Analytics"
        />

       
      </div>
    </div>
  );
};

export default FranchiseAnalytics;

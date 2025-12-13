import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import EnhancedFloatingChatbot from '@site/src/components/EnhancedFloatingChatbot';

export default function Layout(props) {
  return (
    <>
      <OriginalLayout {...props} />
      <EnhancedFloatingChatbot />
    </>
  );
}
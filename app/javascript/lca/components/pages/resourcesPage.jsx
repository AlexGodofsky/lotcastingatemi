import React from 'react'

import Typography from 'material-ui/Typography'

import BlockPaper from '../generic/blockPaper.jsx'

export default function ResourcesPage() {
  return <BlockPaper>
    <Typography variant="headline" gutterBottom>
      Resources
    </Typography>

    <Typography paragraph>
      <a href="https://www.reddit.com/r/exalted/comments/4yby39/madletters_charm_cascades_version_3_including/">
        Charm Cascades and other resources
      </a>
      &nbsp;
      by MadLetter
    </Typography>

    <Typography paragraph>
      <a href="http://forum.theonyxpath.com/forum/main-category/exalted/766048-ex3-i-made-a-1-page-combat-flowchart">
        Combat flowchart
      </a>
      &nbsp;
      by GivenFlesh
    </Typography>

    <Typography paragraph>
      <a href="http://forum.theonyxpath.com/forum/main-category/exalted/1180122-ex3-social-system-cheat-sheet-and-flowchart">
        Social system cheat sheet
      </a>
      &nbsp;
      by Redthorn
    </Typography>

    <Typography paragraph>
      <a href="http://forum.theonyxpath.com/forum/main-category/exalted/65025-exalted-3rd-edition-useful-links-and-topics">
        &apos;Useful Links&apos; thread on the official Exalted forums
      </a>
    </Typography>
  </BlockPaper>
}

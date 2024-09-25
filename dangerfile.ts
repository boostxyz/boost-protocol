import { danger, fail, warn } from 'danger';

// API reference: https://danger.systems/js/reference.html

const pr = danger.github.pr;

const issueKeywords = [
  'close ',
  'closes ',
  'closed ',
  'fix ',
  'fixes ',
  'fixed ',
  'resolve ',
  'resolves ',
  'resolved ',
];

// Rules
try {
  if (pr.title.startsWith('[ADHOC]')) {
    warn(
      'By using the `[ADHOC]` title prefix, you are bypassing best practice protections.',
    );
  } else {
    // Remind people to add some details to the description, 200 accounts for roughly a sentence more than the standard template headers.
    if (pr.body.length < 200) {
      fail('Please add some non-placeholder details to the PR description.');
    }

    // Ensure [BOOST-XXXX] is somewhere in PR title
    const linearRegex = /\[BOOST-\d+\]/;
    if (
      !linearRegex.test(pr.title) &&
      !issueKeywords.some((keyword) => pr.body.includes(keyword))
    ) {
      fail(
        'Your PR body must reference a Github issue using a valid keyword, or your PR title must include the internal Boost ticket number, ie: `[BOOST-1234] Innovate like nuts`',
      );
    }
  }

  // Warn if not including changeset
  const changesets = danger.git.fileMatch('.changeset/*.md');
  if (!changesets.edited) {
    warn(
      `Are you sure you want to be submitting a change without including a changeset? If you're just changing docs or tests, you probably don't need to. See [the publishing section of the README](https://github.com/rabbitholegg/boost-protocol?tab=readme-ov-file#changesets--publishing) for more info.`,
    );
  }
} catch (e) {
  console.error('Danger failed', e);
}

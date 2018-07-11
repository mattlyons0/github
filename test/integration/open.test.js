import fs from 'fs-extra';
import path from 'path';

import {setup, teardown} from './helpers';

describe('opening and closing tabs', function() {
  let context, wrapper, atomEnv, commands, workspaceElement;

  beforeEach(async function() {
    context = await setup(this.currentTest, {
      initialRoots: ['three-files'],
      initConfigDir: configDirPath => fs.writeFile(path.join(configDirPath, 'github.cson'), ''),
      state: {newProject: false},
    });

    wrapper = context.wrapper;
    atomEnv = context.atomEnv;
    commands = atomEnv.commands;

    workspaceElement = atomEnv.views.getView(atomEnv.workspace);
  });

  afterEach(async function() {
    await teardown(context);
  });

  it('opens but does not focus the git tab on github:toggle-git-tab', async function() {
    const editor = await atomEnv.workspace.open(__filename);
    assert.isFalse(wrapper.find('.github-Panel').exists());

    await commands.dispatch(workspaceElement, 'github:toggle-git-tab');

    wrapper.update();
    assert.isTrue(wrapper.find('.github-Panel').exists());

    assert.isTrue(atomEnv.workspace.getRightDock().isVisible());
    await assert.async.strictEqual(atomEnv.workspace.getActivePaneItem(), editor);
  });

  it('reveals an open but hidden git tab on github:toggle-git-tab', async function() {
    await commands.dispatch(workspaceElement, 'github:toggle-git-tab');
    atomEnv.workspace.getRightDock().hide();
    wrapper.update();
    assert.isTrue(wrapper.find('.github-Panel').exists());

    await commands.dispatch(workspaceElement, 'github:toggle-git-tab');
    wrapper.update();

    assert.isTrue(wrapper.find('.github-Panel').exists());
    assert.isTrue(atomEnv.workspace.getRightDock().isVisible());
  });

  it('hides an open git tab on github:toggle-git-tab', async function() {
    await commands.dispatch(workspaceElement, 'github:toggle-git-tab');
    wrapper.update();

    assert.isTrue(wrapper.find('.github-Panel').exists());
    assert.isTrue(atomEnv.workspace.getRightDock().isVisible());

    await commands.dispatch(workspaceElement, 'github:toggle-git-tab');
    wrapper.update();

    assert.isTrue(wrapper.find('.github-Panel').exists());
    assert.isFalse(atomEnv.workspace.getRightDock().isVisible());
  });

  it('opens and focuses the git tab on github:toggle-git-tab-focus', async function() {
    await atomEnv.workspace.open(__filename);

    await commands.dispatch(workspaceElement, 'github:toggle-git-tab-focus');
    wrapper.update();

    assert.isTrue(wrapper.find('.github-Panel').exists());
    assert.isTrue(atomEnv.workspace.getRightDock().isVisible());
    assert.isTrue(wrapper.find('.github-Panel[tabIndex]').getDOMNode().contains(document.activeElement));
  });

  it('focuses a blurred git tab on github:toggle-git-tab-focus', async function() {
    await commands.dispatch(workspaceElement, 'github:toggle-git-tab');
    wrapper.update();

    assert.isTrue(wrapper.find('.github-Panel').exists());
    assert.isTrue(atomEnv.workspace.getRightDock().isVisible());
    assert.isFalse(wrapper.find('.github-Panel[tabIndex]').getDOMNode().contains(document.activeElement));

    await commands.dispatch(workspaceElement, 'github:toggle-git-tab-focus');
    wrapper.update();

    assert.isTrue(wrapper.find('.github-StagingView').getDOMNode().contains(document.activeElement));
  });

  it('blurs an open and focused git tab on github:toggle-git-tab-focus', async function() {
    const editor = await atomEnv.workspace.open(__filename);

    await commands.dispatch(workspaceElement, 'github:toggle-git-tab-focus');
    wrapper.update();

    assert.isTrue(atomEnv.workspace.getRightDock().isVisible());
    assert.isTrue(wrapper.find('.github-StagingView').getDOMNode().contains(document.activeElement));

    await commands.dispatch(workspaceElement, 'github:toggle-git-tab-focus');
    wrapper.update();

    assert.isTrue(atomEnv.workspace.getRightDock().isVisible());
    assert.isTrue(wrapper.find('.github-StagingView').exists());
    assert.isFalse(wrapper.find('.github-StagingView').getDOMNode().contains(document.activeElement));
    assert.strictEqual(atomEnv.workspace.getActivePaneItem(), editor);
  });

});

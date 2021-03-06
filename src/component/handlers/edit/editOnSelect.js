/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule editOnSelect
 * @flow
 */

'use strict';

import type DraftEditor from 'DraftEditor.react';

var EditorState = require('EditorState');
var ReactDOM = require('ReactDOM');

var getDraftEditorSelection = require('getDraftEditorSelection');
const invariant = require('invariant');

function editOnSelect(editor: DraftEditor): void {
  if (editor._blockSelectEvents ||
      editor._latestEditorState !== editor.props.editorState) {
    return;
  }

  var editorState = editor.props.editorState;
  const editorNode = ReactDOM.findDOMNode(editor.refs.editorContainer);
  invariant(editorNode, 'Missing editorNode');
  invariant(
    editorNode.firstChild.contentEditable !== undefined,
    'editorNode.firstChild is not an HTMLElement',
  );
  var documentSelection = getDraftEditorSelection(
    editorState,
    editorNode.firstChild,
  );
  var updatedSelectionState = documentSelection.selectionState;

  if (updatedSelectionState !== editorState.getSelection()) {
    if (documentSelection.needsRecovery) {
      editorState = EditorState.forceSelection(
        editorState,
        updatedSelectionState,
      );
    } else {
      editorState = EditorState.acceptSelection(
        editorState,
        updatedSelectionState,
      );
    }
    editor.update(editorState);
  }
}

module.exports = editOnSelect;

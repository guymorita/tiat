
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const JSON3 = require('json3');

const SELF = 'self';
const GIRL = 'girl';
const NARRATOR = 'narrator';
const BRANCH = 'branch';

const createMessage = function(element, curThreadLen, femaleCharId) {
  let charId = getCharId(element, femaleCharId);
  charId = Number(charId)
  let { wait_sec } = element
  // REMOVE this later
  if (wait_sec < 60) {
    wait_sec = charId < 0 ? 0 : 1
  }
  return {
    text: element.text,
    msg_id: curThreadLen,
    cha_id: Number(charId),
    wait_sec: wait_sec
  }
};

const getCharId = function(element, femaleCharId) {
  switch(element.type) {
    case SELF:
      return 1;
    case GIRL:
      return femaleCharId;
    case NARRATOR:
      return 2;
  }
};

const createBranch = function(element) {
  const { branch_type } = element;
  const isLinearBranch = element.next_thread;
  const isTerminal = element.terminal;
  const isMultiBranch = element.option_a_text;

  switch (branch_type) {
    case "linear":
      return createLinearBranch(element);
    case "multi":
      return createMultiBranch(element);
    case "terminal":
      return createTerminalBranch(element);
    default:
      throw Error('Error branching');
  }
};

const createLinearBranch = function(element) {
  return {
    branch_type: 'linear',
    branch_target: element.next_thread,
    terminal_options: {},
    text: element.text,
    options: []
  }
};

const createMultiBranch = function(element) {
  const options = [
    {
      dec_id: 0,
      text: element.option_a_text,
      target_thread: element.option_a_thread
    },
    {
      dec_id: 1,
      text: element.option_b_text,
      target_thread: element.option_b_thread

    }
  ];

  return {
    branch_type: 'multi',
    branch_target: '',
    terminal_options: {},
    text: element.text,
    options
  }
};

const createTerminalBranch = function(element) {
  const { terminal_type, text } = element;
  return {
    branch_type: 'terminal',
    branch_target: '',
    terminal_options: {
      terminal_type,
      text
    },
    text: element.text,
    options: []
  }
};

const parseConvoJson = function(fileUrl) {
  const baseName = path.basename(fileUrl, '.json');
  const convoJson = require(fileUrl);

  const [femaleCharId, femaleFirstName] = baseName.split('_');
  const OUTPUT_JSON = `scripts/convos/json/${baseName}.json`;

  const threads = {};

  convoJson.forEach(function(element, i) {
    const thread = element.thread;

    const currentThread = threads[thread] = threads[thread] || {};
    const messages = currentThread.messages = currentThread.messages || [];

    currentThread.platform = element.platform;

    const isMessage = [SELF, GIRL, NARRATOR].includes(element.type);
    const isBranch = [BRANCH].includes(element.type);

    if (isMessage) {
      const currentThreadLen = currentThread.messages.length;
      const newMessage = createMessage(element, currentThreadLen, femaleCharId);
      messages.push(newMessage);
    }

    if (isBranch) {
      currentThread.branch = createBranch(element);
    }
  });

  // console.log(util.inspect(threads, {showHidden: false, depth: 4}))

  saveThreadsJson = JSON3.stringify(threads, null, 2);

  fs.outputFileSync(OUTPUT_JSON, saveThreadsJson);
}

const normalizedPath = path.join(__dirname + '/convos/raw_json/');

fs.readdirSync(normalizedPath).forEach(function(file) {
  if (file.includes('DS_Store')) {
    return
  }
  const matchPath = path.join(normalizedPath, file);
  const femaleKey = path.basename(matchPath, '.json');
  const completePath = normalizedPath + file
  parseConvoJson(completePath)
});


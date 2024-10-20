function getCursors() {
  if(!document.body || !document.body.appendChild) {
      return setTimeout(getCursors, 100);
  }
  window.postMessage({'getCustCurs': 1, 'type': 'getCursorData'}, '*');
}

function replaceCursors(parsedCursorsData) {
  const cursorDataId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const cursorsData = document.createElement('script');
  cursorsData.setAttribute('id', cursorDataId);
  cursorsData.appendChild(document.createTextNode(parsedCursorsData + `; document.querySelector('#${cursorDataId}').remove();`));
  document.body.appendChild(cursorsData);
}

function initCursorsFromMes(cursorData, basedCursorData) {
  if(!document.body || !document.body.appendChild) {
      return setTimeout(() => initCursorsFromMes(cursorData, basedCursorData), 100);
  }
  if(basedCursorData) {
      cursorData = basedCursorData + '('+JSON.stringify(cursorData)+')';
  }
  replaceCursors(cursorData);
}

if (window.self === window.top){
  getCursors();
  window.addEventListener('message', e => {
      if(!e || !e.data) return;
      const { _cursor, _cursors, key, handler } = e.data;
      _cursors && initCursorsFromMes(key,handler);
      if(_cursor && !window.zMainFlag){
          window.zMainFlag = 1;
          replaceCursors(decodeURIComponent(escape(atob(_cursor))));
      }
  });
}
else {
  window.addEventListener('message', e => {
      if (e?.data?.cursorWorker) {
          replaceCursors(e.data.cursors);
      }
  });
}
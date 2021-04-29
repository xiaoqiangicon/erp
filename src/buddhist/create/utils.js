// 移除所有的Id字段，包括深层
export function removeIdDeep(d) {
  if (!d || typeof d !== 'object') return;

  if (Array.isArray(d)) {
    for (let i = 0, il = d.length; i < il; i++) {
      const value = d[i];
      if (value && typeof value === 'object') removeIdDeep(value);
    }
  } else if (typeof d === 'object') {
    delete d.id;

    const keys = Object.keys(d);
    for (let i = 0, il = keys.length; i < il; i++) {
      const value = d[keys[i]];
      if (value && typeof value === 'object') removeIdDeep(value);
    }
  }
}

// 移除所有的_开头的临时字段，包括深层
export function removeTmpFieldDeep(d) {
  if (!d || typeof d !== 'object') return;

  if (Array.isArray(d)) {
    for (let i = 0, il = d.length; i < il; i++) {
      const value = d[i];
      if (value && typeof value === 'object') removeTmpFieldDeep(value);
    }
  } else if (typeof d === 'object') {
    const keys = Object.keys(d);
    for (let i = 0, il = keys.length; i < il; i++) {
      const key = keys[i];
      if (key.slice(0, 1) === '_') {
        delete d[key];
        continue;
      }

      const value = d[key];
      if (value && typeof value === 'object') removeTmpFieldDeep(value);
    }
  }
}

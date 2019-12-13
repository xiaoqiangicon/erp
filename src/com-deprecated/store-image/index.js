import data from './data';
import logger from './util/logger';
import getMatches from './get_matches';
import getFullUrl from './get_full_url';
import getReplacedContent from './get_replaced_content';
import saveUrl from './save_url';
class StoreImage {
  constructor(content, callback, progress) {
    let self = this;
    self.content = content;
    self.callback = callback;
    self.progress = progress;
    if (typeof content !== 'string')
      logger.throwError('传入的 content 参数必须是字符串');
    self.init();
  }
  init() {
    let self = this;
    self.urlMatches = getMatches(self.content);
    if (!self.urlMatches || !self.urlMatches.length) {
      self.allSaved();
      return;
    }
    self.tryRecord = {};
    self.savedCount = 0;
    self.save();
  }
  save() {
    let self = this;
    let saveUrlFunc = window.storeImageSaveUrl || saveUrl;
    const url = self.urlMatches[self.savedCount];
    saveUrlFunc(
      getFullUrl(url),
      newUrl => {
        self.saveSuccess(newUrl, url);
      },
      _ => {
        if (!self.tryRecord[url]) self.tryRecord[url] = 1;
        else self.tryRecord[url] += 1;
        if (self.tryRecord[url] >= data.maxTry) self.saveSuccess(url, url);
        else self.saveFail();
      }
    );
  }
  saveSuccess(newUrl, url) {
    let self = this;
    self.afterSave(newUrl, url);
    if (self.savedCount < self.urlMatches.length) {
      if (self.urlMatches.length >= data.requestsIntervalThreshold) {
        setTimeout(() => {
          self.save();
        }, data.requestsInterval);
      } else {
        self.save();
      }
    }
  }
  saveFail() {
    let self = this;
    if (self.urlMatches.length >= data.requestsIntervalThreshold) {
      setTimeout(() => {
        self.save();
      }, data.requestsInterval);
    } else {
      self.save();
    }
  }
  afterSave(newUrl, url) {
    let self = this;
    if (url !== newUrl)
      self.content = getReplacedContent(
        self.content,
        url,
        newUrl + data.suffixToAppend
      );
    self.savedCount += 1;
    if (self.progress) self.progress(self.savedCount, self.urlMatches.length);
    self.savedCount >= self.urlMatches.length && self.allSaved();
  }
  allSaved() {
    let self = this;
    self.callback && self.callback(self.content);
  }
}
class ExportedStoreImage {
  constructor(contents, callback, progress) {
    if (!Array.isArray(contents)) {
      new StoreImage(contents, callback, progress);
      return;
    }
    const self = this;
    self.result = [];
    self.contentsLength = contents.length;
    self.savedCount = 0;
    self.callback = callback;
    contents.forEach((content, index) => {
      new StoreImage(content, newContent => {
        self.saved(
          newContent,
          index,
          Array.isArray(progress) ? progress[index] : undefined
        );
      });
    });
  }
  saved(content, index) {
    const self = this;
    self.result[index] = content;
    self.savedCount += 1;
    if (self.savedCount >= self.contentsLength) {
      self.callback && self.callback(self.result);
    }
  }
}
export default ExportedStoreImage;

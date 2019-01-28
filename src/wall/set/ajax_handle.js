/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', './data', 'lib/jquery.seeAjax'], function($, data) {
  var ajaxHandle = {
    requestKeysOuter: {
      template: {
        id: 'templateId',
      },
      detail: {
        id: 'id',
      },
      deleteTag: {
        id: 'id',
      },
      createTag: {
        name: 'name',
      },
      printerStatus: {
        id: 'printerId',
      },
      create: {
        name: 'type',
        category: 'category',
        buddhaId: 'buddhaModelId',
        tags: 'tagId',
        place: 'place',
        cover: 'supplyAfterPic',
        previewImages: 'coverPic',
        intro: 'introduce',
        randomMoney: 'priceArray',
        memoConfig: 'postScript',
        usePrinter: 'isOpenPrinter',
        printers: 'printerId',
        printType: 'qrcodePrint',
        printPages: 'continuousPrintNum',
        shareTitle: 'shareTitle',
        shareContent: 'shareContent',
        shareImage: 'sharePic',
      },
      edit: {
        id: 'id',
        name: 'type',
        category: 'category',
        buddhaId: 'buddhaModelId',
        tags: 'tagId',
        place: 'place',
        cover: 'supplyAfterPic',
        previewImages: 'coverPic',
        intro: 'introduce',
        randomMoney: 'priceArray',
        memoConfig: 'postScript',
        usePrinter: 'isOpenPrinter',
        printers: 'printerId',
        printType: 'qrcodePrint',
        printPages: 'continuousPrintNum',
        shareTitle: 'shareTitle',
        shareContent: 'shareContent',
        shareImage: 'sharePic',
      },
    },
    responseRefactorOuter: {
      tags: {
        data: {
          system: 'systemTag',
          custom: 'templeTag',
        },
      },
      printers: {
        data: [
          {
            name: 'address',
          },
        ],
      },
      template: {
        data: {
          randomMoney: 'priceArray',
          buddhaId: 'buddhaModelId',
          tags: 'tagId',
          intro: 'introduce',
          memoConfig: 'postScript',
          _memoConfig: [
            {
              type: 'input_type',
              length: 'font_length',
              tip: 'prompt_text',
            },
          ],
          previewImages: 'coverPic',
          cover: 'supplyAfterPic',
          name: 'type',
          shareImage: 'sharePic',
        },
      },
      detail: {
        data: {
          randomMoney: 'priceArray',
          tags: 'tagId',
          intro: 'introduce',
          memoConfig: 'postScript',
          _memoConfig: [
            {
              type: 'input_type',
              length: 'font_length',
              tip: 'prompt_text',
            },
          ],
          previewImages: 'coverPic',
          cover: 'supplyAfterPic',
          printers: 'printerId',
          printType: 'qrcodePrint',
          usePrinter: 'isOpenPrinter',
          printPages: 'continuousPrintNum',
          name: 'type',
          shareImage: 'sharePic',
        },
      },
      createTag: {
        id: 'data.id',
      },
    },
    preHandleOuter: {
      create: function(req) {
        // 佛像名字
        req.name =
          (data.buddhas[req.buddhaModelId] &&
            data.buddhas[req.buddhaModelId].name) ||
          '';
        JSON.refactor(req.postScript, [
          {
            input_type: 'type',
            prompt_text: 'tip',
            font_length: 'length',
          },
        ]);
      },
      edit: function(req) {
        // 佛像名字
        req.name =
          (data.buddhas[req.buddhaModelId] &&
            data.buddhas[req.buddhaModelId].name) ||
          '';
        JSON.refactor(req.postScript, [
          {
            input_type: 'type',
            prompt_text: 'tip',
            font_length: 'length',
          },
        ]);
      },
    },
    postHandleOuter: {
      common: function(res) {
        res.success = res.result >= 0;
        res.msg && (res.message = res.msg);
      },
    },
  };

  return ajaxHandle;
});

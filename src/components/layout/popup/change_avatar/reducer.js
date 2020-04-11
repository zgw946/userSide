import { fromJS } from 'immutable';

const defaultState = fromJS({
  cropImage : '',//裁剪后的图片
  imageId : 0,//上传后的图片ID
});

export default (state = defaultState,action) => {

  switch (action.type){
    case 'image_crop/set_crop_image'://保存裁剪后的照片
      return state.set('cropImage',action.value);
    case 'image_crop/set_image_id'://保存裁剪后的照片ID
      return state.set('imageId',action.value);

    default:
      return state;
  }
}
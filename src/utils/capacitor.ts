import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();

export const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    return image.webPath;
  } catch (error) {
    console.error('Camera error:', error);
    throw error;
  }
};

export const pickImages = async (multiple = true) => {
  try {
    const images = await Camera.pickImages({
      quality: 90,
      limit: multiple ? 0 : 1
    });

    return images.photos.map(photo => photo.webPath);
  } catch (error) {
    console.error('Pick images error:', error);
    throw error;
  }
};

export const savePDFToDevice = async (blob: Blob, filename: string) => {
  try {
    const base64Data = await blobToBase64(blob);

    const result = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Documents
    });

    return result.uri;
  } catch (error) {
    console.error('Save PDF error:', error);
    throw error;
  }
};

export const sharePDF = async (blob: Blob, filename: string, title: string) => {
  try {
    const base64Data = await blobToBase64(blob);

    const result = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache
    });

    await Share.share({
      title: title,
      text: title,
      url: result.uri,
      dialogTitle: 'Share Report'
    });
  } catch (error) {
    console.error('Share error:', error);
    throw error;
  }
};

export const requestCameraPermissions = async () => {
  try {
    const permission = await Camera.checkPermissions();

    if (permission.camera !== 'granted' || permission.photos !== 'granted') {
      const result = await Camera.requestPermissions({
        permissions: ['camera', 'photos']
      });

      return result.camera === 'granted' && result.photos === 'granted';
    }

    return true;
  } catch (error) {
    console.error('Permission error:', error);
    return false;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const urlToFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

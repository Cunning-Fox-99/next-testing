export const getCroppedImg = (imageSrc: string, crop: any): Promise<string> => {
	return new Promise((resolve, reject) => {
	  const canvas = document.createElement('canvas');
	  const ctx = canvas.getContext('2d');
	  
	  if (!ctx) {
		reject(new Error('Failed to get canvas context'));
		return;
	  }
  
	  const image = new Image();
	  image.src = imageSrc;
	  image.onload = () => {
		const { width, height } = image;
		const { x, y, width: cropWidth, height: cropHeight } = crop;
  
		// Устанавливаем размеры canvas в соответствии с размерами обрезки
		canvas.width = cropWidth;
		canvas.height = cropHeight;
  
		// Рисуем изображение на canvas с учетом обрезки
		ctx.drawImage(
		  image,
		  x,
		  y,
		  cropWidth,
		  cropHeight,
		  0,
		  0,
		  cropWidth,
		  cropHeight
		);
  
		// Получаем data URL изображения из canvas
		const dataUrl = canvas.toDataURL('image/jpeg');
  
		resolve(dataUrl);
	  };
	  image.onerror = reject;
	});
  };
  
export const filesToDataURLs = async (files: File[]): Promise<string[]> => {
  const tasks = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      }),
  );

  return Promise.all(tasks);
};

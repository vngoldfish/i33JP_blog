import React from 'react';

// Sử dụng `unknown` thay vì `{}` để giúp ESLint không báo lỗi
const FormWrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div className="max-w-5xl flex row items-center justify-center p-10 w-full lg:w-full mx-auto pb-20">
        {children}
    </div>
  );
};

export default FormWrapper;

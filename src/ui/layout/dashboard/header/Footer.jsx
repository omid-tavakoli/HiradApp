import { digitsEnToFa } from "@persian-tools/persian-tools";

const Footer = () => {
  return (
    <div className="bg-white flex flex-row justify-between items-center my-2.5 px-4">
      <div className="text-xs text-gray-700">
        کلیه حقوق این سرویس محفوظ و متعلق به گروه تجارت الکترونیک راد می‌باشد.
      </div>
      <div className="text-xs text-gray-700">
        {digitsEnToFa(1403)} © گروه تجارت الکترونیک راد
      </div>
    </div>
  );
};

export default Footer;

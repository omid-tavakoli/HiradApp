import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import RealContractorAdminForm from "./real-contractor-admin/RealContractorAdminForm";
import LegalContractorAdminForm from "./legal-contractor-admin/LegalContractorAdminForm";

const ContractorAdminsForm = ({
  onClose,
  setModalContent,
  projectId,
  refetch,
  defaulteValue
}) => {
  const [contractorAdminType, setContractorAdminType] = React.useState("real");

  const handleChange = (event) => {
    setContractorAdminType(event.target.value);
  };
  return (
    <>
      <div className="flex flex-row items-center">
        <span className="text-xs text-gray-600">نوع کاربر</span>
        <RadioGroup value={contractorAdminType} onChange={handleChange}>
          <FormControlLabel
            value="real"
            control={<Radio size="small" />}
            label="حقیقی"
          />
          <FormControlLabel
            value="legal"
            control={<Radio size="small" />}
            label="حقوقی"
          />
        </RadioGroup>
      </div>
      <div>
        {contractorAdminType === "real" ? (
          <RealContractorAdminForm
            onClose={onClose}
            setModalContent={setModalContent}
            projectId={projectId}
            refetch={refetch}
            defaulteValue={defaulteValue}
          />
        ) : (
          <LegalContractorAdminForm
            onClose={onClose}
            setModalContent={setModalContent}
            projectId={projectId}
            refetch={refetch}
            defaulteValue={defaulteValue}
          />
        )}
      </div>
    </>
  );
};

export default ContractorAdminsForm;

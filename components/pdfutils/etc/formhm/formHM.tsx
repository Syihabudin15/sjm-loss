import { IDapem } from "@/libs/IInterfaces";
import { FormCIF } from "./formCIF";
import { FormCIF2 } from "./formCIF2";
import { FormCIF3 } from "./formCIF3";
import { FormRek1 } from "./formRek1";
import { FormSnK } from "./formSnK";
import { FormSnK2 } from "./formSnK2";
import { FormSliknKredit } from "./formSliknKredit";
import { FormSliknKredit2 } from "./formSliknKredit2";

export const FormHM = (record: IDapem) => {
  return `
      <div class="page-break" style="font-size: 8px;">
        ${FormCIF(record)}
      </div>
      <div class="page-break" style="font-size: 8px;">
        ${FormCIF2()}
      </div>
      <div class="page-break" style="font-size: 8px;">
        ${FormCIF3(record)}
      </div>
      <div class="page-break" style="font-size: 9px;">
        ${FormRek1(record)}
      </div>
      <div class="page-break" style="font-size: 10px;">
        ${FormSnK()}
      </div>
      <div class="page-break" style="font-size: 10px;">
        ${FormSnK2(record)}
      </div>
      <div class="page-break" style="font-size: 11px;">
        ${FormSliknKredit(record)}
      </div>
      <div class="page-break" style="font-size: 11px;">
        ${FormSliknKredit2(record)}
      </div>
    `;
};

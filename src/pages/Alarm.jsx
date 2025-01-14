import { Box, Stack } from "@mui/material";
import { StyledButton } from "../ui/StyledButton";
import StyledTable from "../components/StyledTable";
import Icon from "@mdi/react";
import { mdiCalculator, mdiFileDocumentOutline } from "@mdi/js";
import { useEffect, useState } from "react";
import { useListStore } from "../store/listStore";
import { useParams } from "react-router-dom";
import { alarmColumn } from "../json/TableData";
import { generateExcel } from "../utils/generateExcel";
import { getAlarmDownload } from "../api/adminapi";

const Alarm = ({ refresh }) => {
  const { getAlarms } = useListStore();
  const { id } = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;

    getAlarms(id);
  }, [pageNo, row, refresh]);
      const handleDownload = async () => {
        try {
          const data = await getAlarmDownload(id);
          const csvData = data;
    
          if (csvData) {
            generateExcel(csvData);
          } else {
            console.error(
              "Error: Missing headers or data in the downloaded content"
            );
          }
        } catch (error) {
          console.error("Error downloading users:", error);
        }
      };
  return (
    <>
      <Stack spacing={4}>
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <StyledTable
            menu
            columns={alarmColumn}
            pageNo={pageNo}
            setPageNo={setPageNo}
            rowPerSize={row}
            setRowPerSize={setRow}
            checkbox
          />
        </Box>
        <Stack justifyContent={"flex-end"} direction={"row"} spacing={2}>
          {/* <StyledButton
            variant={"pdf"}
            name={
              <>
                pdf <Icon path={mdiFileDocumentOutline} size={1} />
              </>
            }
          /> */}
          <StyledButton
            variant={"download"}
            name={
              <>
                Excel <Icon path={mdiCalculator} size={1} />
              </>
            } onClick={handleDownload}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default Alarm;

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Stack,
  TablePagination,
  IconButton,
  Checkbox,
  Menu,
  MenuItem,
  Typography,
  Skeleton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import moment from "moment";
import Icon from "@mdi/react";
import {
  mdiClose,
  mdiDotsVertical,
  mdiGreaterThan,
  mdiLessThan,
  mdiStar,
} from "@mdi/js";
import { StyledButton } from "../ui/StyledButton";
import { useListStore } from "../store/listStore";
import { set } from "react-hook-form";

const StyledTableCell = styled(TableCell)`
  &.${tableCellClasses.head} {
    background-color: #fff;
    color: #042f61;
    font-size: 12px;
    padding: 14px;

    text-align: center;

    font-weight: 600;
  }
  &.${tableCellClasses.body} {
    font-size: 10px;
    background-color: #fff;
    padding: 14px;
    font-weight: 100;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
  }
`;
const ScrollableContainer = styled.div`
  overflow-x: auto;
  white-space: nowrap;
`;
const PaginationContainer = styled.div`
  position: sticky;
  bottom: 0;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 10;
  display: flex;
  justify-content: end;
`;
const StyledTable = ({
  columns,
  onSelectionChange,
  onView,
  onDelete,
  onModify,
  menu,
  pageNo,
  setPageNo,
  onDeleteRow,
  rowPerSize,
  setRowPerSize,
  checkbox,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowId, setRowId] = useState(null);
  const { lists, totalCount, loading } = useListStore();
  const [openPk, setOpenPk] = useState(false);
  const [pkData, setPkData] = useState({});
  const [dialogState, setDialogState] = useState({
    open: false,
    oldPayload: {},
    newPayload: {},
    name: "",
    pk: "",
    field:""
  });

  const handleOpen = (oldPayload, newPayload, name, pk,field) => {
    setDialogState({ open: true, oldPayload, newPayload, name, pk ,field});
  };

  const handleClose = () => {
    setDialogState({ open: false, oldPayload: {}, newPayload: {}, name: "", pk: "",field:"" });
  };
  // Memoize status variant calculation
  const getStatusVariant = useMemo(
    () => (status) => {
      if (typeof status === "boolean") {
        return status ? "green" : "red";
      }
      switch (status) {
        case "pending":
          return "#FF9F00";
        case "rejected":
          return "#C62828";
        case "active":
          return "#4CAF50";
        case "deleted":
          return "#9E9E9E";
        case "cancelled":
          return "#FF5722";
        case "blocked":
          return "red";
        case "published":
          return "#3F51B5";
        case "unpublished":
          return "#9C27B0";
        case "created":
          return "#FFC107";
        case "success":
          return "#4CAF50";
        case "failure":
          return "red";
        case "live":
          return "#03A9F4";
        default:
          return "#607D8B";
      }
    },
    []
  );

  const formatIndianDate = useMemo(
    () => (date) => {
      return moment.utc(date).format("DD-MM-YYYY");
    },
    []
  );

  const formatTime = useMemo(
    () => (time) => {
      return moment(time).format("h:mm A");
    },
    []
  );

  const isSelected = useMemo(
    () => (id) => selectedIds.includes(id),
    [selectedIds]
  );

  const paginationData = useMemo(
    () => ({
      totalPages: Math.ceil(totalCount / rowPerSize),
      canDecrementPage: pageNo > 1,
      canIncrementPage: pageNo < Math.ceil(totalCount / rowPerSize),
    }),
    [totalCount, rowPerSize, pageNo]
  );

  const tableHeaders = useMemo(
    () => (
      <TableHead>
        <TableRow>
          {!checkbox && (
            <StyledTableCell padding="checkbox">
              <Checkbox
                checked={
                  lists &&
                  lists.length > 0 &&
                  selectedIds.length === lists.length
                }
                onChange={(event) => {
                  const newSelectedIds = event.target.checked
                    ? lists?.map((row) => row._id)
                    : [];
                  setSelectedIds(newSelectedIds);
                  onSelectionChange(newSelectedIds);
                }}
              />
            </StyledTableCell>
          )}

          {columns.map((column) => (
            <StyledTableCell
              key={column.field}
              padding={column.padding || "normal"}
            >
              {column.title}
            </StyledTableCell>
          ))}
          <StyledTableCell padding="normal"></StyledTableCell>
        </TableRow>
      </TableHead>
    ),
    [columns, lists, selectedIds, onSelectionChange]
  );
  const loadingSkeleton = useMemo(
    () =>
      Array.from(new Array(5)).map((_, index) => (
        <StyledTableRow key={index}>
          {!checkbox && (
            <StyledTableCell padding="checkbox">
              <Skeleton variant="rectangular" width={24} height={24} />
            </StyledTableCell>
          )}
          {columns.map((column) => (
            <StyledTableCell key={column.field}>
              <Skeleton variant="text" width="100%" height={20} />
            </StyledTableCell>
          ))}
          <StyledTableCell>
            <Box display="flex" alignItems="center">
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ marginLeft: 1 }}
              />
            </Box>
          </StyledTableCell>
        </StyledTableRow>
      )),
    [columns]
  );

  const renderCellContent = useMemo(
    () => (column, row) => {
      if (column.field === "changes") {
        return (
          <span
            onClick={() =>
              handleOpen(
                row.oldPayload || {},
                row.newPayload || {},
                row.projectName || "",
                row.pk || "",
                row.pkName || ""
              )
            }
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
            }}
          >
            View Details
          </span>
        );
      }
      if (column.field === "pk") {
        return (
          <span
            onClick={() => {
              setOpenPk(true);
              setPkData(row.mto);
            }}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
            }}
          >
            {row[column.field]}
          </span>
        );
      }

      if (["createdAt", "issuedDate"].includes(column.field)) {
        return formatIndianDate(row[column.field]);
      }

      if (["time"].includes(column.field)) {
        return formatTime(row[column.field]);
      }

      if (column.field === "status" || column.field === "activate") {
        return (
          <Box display="flex" alignItems="center" justifyContent="center">
            <span
              style={{
                color: getStatusVariant(row[column.field]),
                padding: "3px 8px",
                borderRadius: "100px",
                border: `1px solid ${getStatusVariant(row[column.field])}`,
              }}
            >
              {row[column.field] === true || row[column.field] === "activated"
                ? "active"
                : row[column.field] === false ||
                  row[column.field] === "deactivated"
                ? "inactive"
                : row[column.field]}
            </span>
          </Box>
        );
      }

      if (
        typeof row[column.field] === "string" &&
        row[column.field].length > 30
      ) {
        return `${row[column.field].slice(0, 30)}...`;
      }

      return row[column.field];
    },
    [formatIndianDate, formatTime, getStatusVariant]
  );

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setRowId(null);
  };

  const handleDelete = () => {
    onDelete();
    setSelectedIds([]);
    handleMenuClose();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowPerSize(parseInt(event.target.value, 10));
    setPageNo(1);
  };

  return (
    <Box bgcolor={"white"} borderRadius={"16px"}>
      <ScrollableContainer>
        <TableContainer sx={{ border: "none" }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            {tableHeaders}
            <TableBody>
              {loading ? (
                loadingSkeleton
              ) : lists?.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={columns.length + 2}>
                    <Typography variant="h7" textAlign="center">
                      No data
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                lists?.map((row) => (
                  <StyledTableRow
                    role="checkbox"
                    key={row._id}
                    selected={isSelected(row._id)}
                  >
                    {!checkbox && (
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(row._id)}
                          onChange={(event) => {
                            const newSelectedIds = event.target.checked
                              ? [...selectedIds, row._id]
                              : selectedIds.filter((id) => id !== row._id);
                            setSelectedIds(newSelectedIds);
                            onSelectionChange(newSelectedIds);
                          }}
                        />
                      </StyledTableCell>
                    )}
                    {columns.map((column) => (
                      <StyledTableCell
                        key={column.field}
                        padding={column.padding || "normal"}
                        sx={{ cursor: "pointer" }}
                        onClick={() => onView(row._id)}
                      >
                        {renderCellContent(column, row)}
                      </StyledTableCell>
                    ))}
                    <StyledTableCell padding="normal">
                      <Box display="flex" alignItems="center">
                        {!menu && (
                          <IconButton
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleMenuOpen(event, row._id)}
                          >
                            <Icon path={mdiDotsVertical} size={1} />
                          </IconButton>
                        )}
                        <Menu
                          id="row-menu"
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && rowId === row._id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            onClick={() => {
                              onModify(row._id);
                              handleMenuClose();
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              onDeleteRow(row._id);
                              handleMenuClose();
                            }}
                            style={{ color: "red" }}
                          >
                            Remove
                          </MenuItem>
                        </Menu>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationContainer>
          <Stack
            direction={"row"}
            justifyContent={
              selectedIds?.length > 0 ? "space-between" : "flex-end"
            }
            alignItems="center"
          >
            {selectedIds?.length > 0 && (
              <Stack direction="row" alignItems="center">
                <Typography paddingRight={3}>
                  {`${selectedIds?.length} item${
                    selectedIds?.length > 1 ? "s" : ""
                  } selected`}
                </Typography>
                <StyledButton
                  variant="primary"
                  name="Delete"
                  onClick={() => handleDelete(selectedIds)}
                />
              </Stack>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <TablePagination
                  component="div"
                  rowsPerPage={rowPerSize}
                  labelRowsPerPage={
                    <Typography sx={{ fontSize: "12px" }}>
                      Rows per page:
                    </Typography>
                  }
                  labelDisplayedRows={({ from, to }) =>
                    `${pageNo}-${paginationData.totalPages} of ${totalCount}`
                  }
                  sx={{
                    "& .MuiTablePagination-toolbar": {
                      fontSize: "12px",
                    },
                    "& .MuiTablePagination-displayedRows": {
                      fontSize: "12px",
                    },
                  }}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={({ onPageChange }) => (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      marginLeft={2}
                    >
                      <Box
                        onClick={
                          paginationData.canDecrementPage
                            ? () => setPageNo((prev) => prev - 1)
                            : null
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: paginationData.canDecrementPage
                            ? "pointer"
                            : "not-allowed",
                          opacity: paginationData.canDecrementPage ? 1 : 0.5,
                        }}
                      >
                        <Icon path={mdiLessThan} size={0.6} />
                      </Box>
                      <Box
                        onClick={
                          paginationData.canIncrementPage
                            ? () => setPageNo((prev) => prev + 1)
                            : null
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: paginationData.canIncrementPage
                            ? "pointer"
                            : "not-allowed",
                          opacity: paginationData.canIncrementPage ? 1 : 0.5,
                        }}
                      >
                        <Icon path={mdiGreaterThan} size={0.6} />
                      </Box>
                    </Stack>
                  )}
                />
              </Box>
            </Stack>
          </Stack>
        </PaginationContainer>
      </ScrollableContainer>
      <Dialog
        open={dialogState.open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction={"row"} justifyContent={"space-between"}>
            {" "}
            <Typography variant="h7" color="textSecondary"  textTransform={"capitalize"}>
              {" "}
              {dialogState?.name} Details
            </Typography>
            <Typography variant="h7" color="textSecondary" textTransform={"capitalize"}>
              {" "}
             {dialogState?.field} : {dialogState?.pk}
            </Typography>
            <Box sx={{ cursor: "pointer" }} onClick={handleClose}>
              <Icon path={mdiClose} size={1} />
            </Box>{" "}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Field</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Change</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(dialogState?.oldPayload).length === 0 &&
                  Object.keys(dialogState?.newPayload).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography fontSize={"12px"} color="textSecondary">
                          No data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.from(
                      new Set([
                        ...Object.keys(dialogState?.oldPayload),
                        ...Object.keys(dialogState?.newPayload),
                      ])
                    ).map((key) => (
                      <TableRow key={key}>
                        <TableCell>
                          <Typography fontSize={"12px"}>
                            <strong>{key}</strong>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={"12px"} color="textPrimary">
                            {dialogState?.oldPayload[key] !== undefined
                              ? String(dialogState?.oldPayload[key])
                              : "—"}{" "}
                            →{" "}
                            {dialogState?.newPayload[key] !== undefined
                              ? String(dialogState?.newPayload[key])
                              : "—"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openPk}
        onClose={() => setOpenPk(false)}
        maxWidth="md"
        fullWidth
      >
        {" "}
        <DialogTitle>
          <Stack direction={"row"} justifyContent={"space-between"}>
            {" "}
            <Typography variant="h6" color="textSecondary">
              {" "}
              Mto Details
            </Typography>
            <Box sx={{ cursor: "pointer" }} onClick={() => setOpenPk(false)}>
              <Icon path={mdiClose} size={1} />
            </Box>{" "}
          </Stack>
        </DialogTitle>
        <DialogContent>
          {Object.keys(pkData)?.filter((key) => key !== "_id" && key !== "__v")
            .length > 0 ? (
            <Grid container spacing={3}>
              {(() => {
                const filteredKeys = Object.keys(pkData)?.filter(
                  (key) => key !== "_id" && key !== "__v" && key !== "project"
                );
                const midPoint = Math.ceil(filteredKeys.length / 2);

                const partition1 = filteredKeys.slice(0, midPoint);
                const partition2 = filteredKeys.slice(midPoint);

                return (
                  <>
                    <Grid item xs={6}>
                      <Table>
                        <TableBody>
                          {partition1.map((key) => (
                            <TableRow key={key}>
                              <TableCell>
                                <Typography variant="h8" color="textPrimary">
                                  {key}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h9" color="textSecondary">
                                  {pkData[key]}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>
                    <Grid item xs={6}>
                      <Table>
                        <TableBody>
                          {partition2.map((key) => (
                            <TableRow key={key}>
                              <TableCell>
                                <Typography variant="h8" color="textPrimary">
                                  {key}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h9" color="textSecondary">
                                  {pkData[key]}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>
                  </>
                );
              })()}
            </Grid>
          ) : (
            <Typography variant="h7" color="textSecondary">
              No data available.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StyledTable;

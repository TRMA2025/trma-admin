import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  CircularProgress,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import moment from "moment";
import { ListCoinResets, ExportCoinResets } from "src/DAL/Coins/Coins";

/* Admin view of the coin reset log (15 Sep 2026).
 *
 * Read and export only. Every row is a reset performed by a teacher: who did
 * it, when, which pupils, and the reason they gave. Filterable by school so a
 * single school's record can be pulled out and exported.
 */
export default function CoinResets() {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [school, setSchool] = useState("");
  const [scope, setScope] = useState("");
  const [exporting, setExporting] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const result = await ListCoinResets({
        page,
        limit: rowsPerPage,
        school: school.trim(),
        scope,
      });
      if (result.code === 200) {
        setRows(result.coin_resets || []);
        setTotalCount(result.total_count || 0);
        setUnavailable(false);
      } else {
        // 404 here means COINS_YEARS is off on this backend.
        setUnavailable(true);
        setRows([]);
      }
    } catch (e) {
      setUnavailable(true);
      setRows([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, [page, rowsPerPage, scope]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await ExportCoinResets({ school: school.trim(), scope });
    } catch (e) {
      enqueueSnackbar("Could not export the reset log", { variant: "error" });
    }
    setExporting(false);
  };

  if (isLoading) {
    return (
      <CircularProgress
        style={{ marginLeft: "50%", marginTop: "20%" }}
        color="primary"
      />
    );
  }

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-lg-6 col-sm-12">
          <h2>Coin Resets</h2>
        </div>
        <div className="col-lg-6 col-sm-12 text-end">
          <button
            className="small-contained-button"
            disabled={exporting || unavailable}
            onClick={handleExport}
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {unavailable ? (
        <Card style={{ padding: "24px" }}>
          <p className="mb-0">
            Coin year resets are not enabled on this environment.
          </p>
        </Card>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-lg-4 col-sm-12">
              <TextField
                fullWidth
                size="small"
                label="School (member id)"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                onBlur={() => {
                  setPage(0);
                  load();
                }}
                helperText="Leave blank for all schools"
              />
            </div>
            <div className="col-lg-3 col-sm-12">
              <TextField
                select
                fullWidth
                size="small"
                label="Scope"
                value={scope}
                onChange={(e) => {
                  setPage(0);
                  setScope(e.target.value);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="child">Single pupil</MenuItem>
                <MenuItem value="class">Whole class</MenuItem>
              </TextField>
            </div>
          </div>

          <Card style={{ overflowX: "auto" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Scope</TableCell>
                    <TableCell>Pupils</TableCell>
                    <TableCell>Coins Cleared</TableCell>
                    <TableCell>By</TableCell>
                    <TableCell>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        No coin resets recorded
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row._id} hover>
                        <TableCell>
                          {row.reset_at
                            ? moment(row.reset_at).format("DD-MM-YYYY HH:mm")
                            : ""}
                        </TableCell>
                        <TableCell>{row.academic_year_label}</TableCell>
                        <TableCell>
                          {row.scope === "class" ? "Whole class" : "Single pupil"}
                        </TableCell>
                        <TableCell>{row.children_count}</TableCell>
                        <TableCell>{row.coins_cleared}</TableCell>
                        <TableCell>
                          <Tooltip title={row.by_email || ""}>
                            <span>{row.by}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell style={{ maxWidth: 320 }}>
                          {row.reason}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Card>
        </>
      )}
    </div>
  );
}

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default function ListStagesTypeSkeleton() {
  return (
    <div>
      <Card style={{ overflowX: "auto" }}>
        <div className="mt-2 d-flex justify-content-between">
          <div style={{ marginLeft: "5px" }}>
            <Skeleton width={200} height={20} />
          </div>
          <div style={{ marginRight: "15px" }}>
            <Skeleton width={200} height={60} />
          </div>
        </div>

        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Skeleton for Table Header */}
                <TableCell>
                  <Skeleton width={150} height={20} />
                </TableCell>
                <TableCell>
                  <Skeleton width={50} height={20} />
                </TableCell>
                <TableCell>
                  <Skeleton width={200} height={20} />
                </TableCell>
                <TableCell>
                  <Skeleton width={100} height={20} />
                </TableCell>
                <TableCell>
                  <Skeleton width={100} height={20} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Skeleton Loading for Rows */}
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={50} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={50} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={200} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            margin: "20px",
            justifyContent: "end",
            display: "flex",
          }}
        >
          <Skeleton width={200} height={20} />
        </div>
      </Card>
    </div>
  );
}

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

export default function ListSkeleton() {
  return (
    <div>
      <Card style={{ overflowX: "auto" }}>
        {/* Skeleton for table content */}
        <div className="mt-2 d-flex justify-content-between">
          <div style={{ marginLeft: "5px" }}>
            <Skeleton width={200} height={20} />
          </div>
          <div className="d-flex" style={{ marginRight: "15px" }}>
            <Skeleton width={200} height={60} />
            <div style={{ margin: "10px" }}>
              <Skeleton
                baseColor="#dddde8"
                highlightColor="#9F00FF"
                width={70}
                height={40}
              />
            </div>
          </div>
        </div>

        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton width={150} height={20} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <TableCell key={idx}>
                      <Skeleton width={idx === 2 ? 200 : 100} height={20} />
                    </TableCell>
                  ))}
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

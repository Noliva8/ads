
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { Card, CardContent, useTheme, Divider, Button, CircularProgress } from "@mui/material";






export default function QuoteCard({colors, quote, loading, handleConfirm, steps} ){



    return(

 <Box width='100%' height='100vh'>
                  
                  <Card
                    sx={{

                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: colors.blackNeutral[600],
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color={colors.graySoft[100]}
                        mb={1}
                      >
                        Quote & Info
                      </Typography>

                      <Divider
                        sx={{ my: 1, borderColor: colors.blackNeutral[500] }}
                      />

                      {!quote ? (
                        <Typography color={colors.graySoft[400]}>
                          Enter basic info and click "Calculate Price"
                        </Typography>
                      ) : (
                        <>
                          <Box mb={2}>
                            <Typography
                              variant="subtitle2"
                              color={colors.graySoft[400]}
                            >
                              Campaign Details
                            </Typography>
                            <Typography color={colors.graySoft[300]}>
                              Location:{" "}
                              <strong style={{ color: colors.orange[500] }}>
                                {quote.location?.name || "Not specified"}
                              </strong>
                            </Typography>
                            <Typography color={colors.graySoft[300]}>
                              Market Tier:{" "}
                              <strong style={{ color: colors.orange[500] }}>
                                {quote.marketSize === "major"
                                  ? "Major Market"
                                  : quote.marketSize === "minor"
                                    ? "Standard Market"
                                    : "Country-wide"}
                              </strong>
                            </Typography>
                            {quote.isMajorCity !== null && (
                              <Typography color={colors.graySoft[300]}>
                                Major City:{" "}
                                <strong style={{ color: colors.orange[500] }}>
                                  {quote.isMajorCity ? "Yes" : "No"}
                                </strong>
                              </Typography>
                            )}
                          </Box>

                          <Box mb={2}>
                            <Typography
                              variant="subtitle2"
                              color={colors.graySoft[400]}
                            >
                              Pricing Breakdown
                            </Typography>
                            <Typography color={colors.graySoft[300]}>
                              Daily Rate:{" "}
                              <strong style={{ color: colors.orange[500] }}>
                                ${quote.perDay?.toFixed(2)}
                              </strong>
                            </Typography>
                            <Typography color={colors.graySoft[300]}>
                              Duration:{" "}
                              <strong>
                                {quote.days} day{quote.days !== 1 ? "s" : ""}
                              </strong>
                            </Typography>
                            <Typography color={colors.graySoft[300]}>
                              Total Cost:{" "}
                              <strong style={{ color: colors.orange[500] }}>
                                ${quote.totalPrice?.toFixed(2)}
                              </strong>
                            </Typography>
                            <Typography
                              variant="caption"
                              color={colors.graySoft[400]}
                              display="block"
                              mt={1}
                            >
                              (Calculated at ${quote.perDay?.toFixed(2)}/day ×{" "}
                              {quote.days} days)
                            </Typography>
                          </Box>

                          <Box mt={3}>

                         {steps === 0 &&(
<Button
                              variant="contained"
                              fullWidth
                              disabled={loading}
                              
                              sx={{
                                backgroundColor:
                                  colors.greenAccent?.[500] ||
                                  colors.orange[500],
                                "&:hover": {
                                  backgroundColor:
                                    colors.greenAccent?.[600] ||
                                    colors.orange[600],
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                },
                                transition: "all 0.3s ease",
                              }}
                              onClick={handleConfirm}

                            >
                              {loading ? (
                                <CircularProgress
                                  size={24}
                                  sx={{ color: "white" }}
                                />
                              ) : (
                                "Confirm & Continue"
                              )}

                             
                            </Button>
                         )}
                            

                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Box>





    )
}
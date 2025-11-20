import { TextField } from '@mui/material';
import React from 'react'
import CustomPopover from 'src/components/MenuOption/CustomPopover';

export default function QuestionsList({ questionsList, MENU_OPTIONS }) {
    return (
        questionsList &&
        questionsList.map((questions, index) => {
            return (
                <div className="row question-background mt-2 pb-3 pb-md-0" key={index}>
                    <div className="col-12 col-lg-8 col-md-8 mt-4 mb-3">
                        <TextField
                            label="Question Statement"
                            variant="outlined"
                            fullWidth
                            value={questions.question_statement}
                            disabled
                            className="question_statement_text"
                        />
                    </div>
                    <div className="col-10 col-lg-3 col-md-3 mt-4">
                        <TextField
                            label="Question Type"
                            variant="outlined"
                            fullWidth
                            value={
                                questions.question_type === "mcq"
                                    ? "Multiple Choice"
                                    : "Scaling"
                            }
                            disabled
                        />
                    </div>
                    <div className="col-2 col-lg-1 col-md-1 mt-4">
                        <CustomPopover
                            menu={MENU_OPTIONS}
                            data={questions}
                        />
                    </div>
                </div>
            );
        })
    );
}

/*
 * print_ratio.h
 * Declarations for *print_ratio()
 *
 * Copyright (C) 2008-2012 Cosmin Truta.
 *
 * This software is distributed under the zlib license.
 * Please see the attached LICENSE for more information.
 */

#ifndef PRINT_RATIO_H
#define PRINT_RATIO_H

#include <stdio.h>
#include "../osys.h"

int
fprint_fsize_ratio(FILE *stream,
                   osys_fsize_t num, osys_fsize_t denom,
                   int force_percent);

int
sprint_fsize_ratio(char *buf, size_t bufsize,
                   osys_fsize_t num, osys_fsize_t denom,
                   int force_percent);

#endif  /* PRINT_RATIO_H */

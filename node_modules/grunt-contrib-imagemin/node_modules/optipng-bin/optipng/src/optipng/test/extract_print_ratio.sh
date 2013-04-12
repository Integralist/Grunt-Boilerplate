#!/bin/sh

set -e

testdir=$(dirname "$0")
srcfile="$testdir/../optim.c"

header='/*\
 * *print_ratio.generated.c\
 * Generated from optim.c\
 *\
 * Copyright (C) 2008-2012 Cosmin Truta.\
 *\
 * This software is distributed under the zlib license.\
 * Please see the attached LICENSE for more information.\
 */\
\
#include "print_ratio.h"\
#include <stdio.h>\
#include "../osys.h"\
'

snprintf_hack='#ifdef _MSC_VER\
#define snprintf _snprintf\
#endif\
'

extract_fprint_ratio_script="
1 i\\
$header
/return/ d
s/usr_printf(/return fprintf(stream, /
/^opng_print_fsize_ratio/ i\\
int
s/^opng_print_fsize_ratio(/fprint_fsize_ratio(FILE *stream, /
/^fprint_fsize_ratio/,/^}/ p
"

extract_sprint_ratio_script="
1 i\\
$header
1 i\\
$snprintf_hack
/return/ d
s/usr_printf(/return snprintf(buf, bufsize, /
/^opng_print_fsize_ratio/ i\\
int
s/^opng_print_fsize_ratio(/sprint_fsize_ratio(char *buf, size_t bufsize, /
/^sprint_fsize_ratio/,/^}/ p
"

sed -n "$extract_fprint_ratio_script" "$srcfile" > fprint_ratio.generated.c
sed -n "$extract_sprint_ratio_script" "$srcfile" > sprint_ratio.generated.c

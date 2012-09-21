//
//  ShowSuccessVCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "ShowSuccessVCO.h"


@implementation ShowSuccessVCO

+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    UITextView *resultView = [parameters objectForKey:@"resultDisplay"];
    NSString *displayString = [NSString stringWithFormat:@"%@ inserted!",[parameters objectForKey:@"name"]];
    resultView.text = displayString;
    return QC_STACK_CONTINUE;
}
@end



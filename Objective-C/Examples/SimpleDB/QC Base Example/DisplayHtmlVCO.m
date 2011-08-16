//
//  DisplayHtmlVCO.m
//  QC Example
//
//  Created by Lee Barney on 3/16/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "DisplayHtmlVCO.h"


@implementation DisplayHtmlVCO
+ (BOOL) handleIt:(NSMutableDictionary*) parameters{
    UITextView *resultView = [parameters objectForKey:@"resultDisplay"];
    NSString *displayString = [parameters objectForKey:@"html"];
    resultView.text = displayString;
    return QC_STACK_EXIT;

}
@end

//
//  UrlCheckValCO.m
//  QC Example
//
//  Created by Lee Barney on 3/16/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "UrlCheckValCO.h"
#import "QCRequestHandler.h"


@implementation UrlCheckValCO
+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    
    UITextView *urlInput = [parameters objectForKey:@"urlInput"];
    NSString *aUrl = urlInput.text;
    [parameters setValue:aUrl forKey:@"url"];
    aUrl = [aUrl stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    if ([aUrl length] == 0) {
        //an example of how to handle a validation failure
        QCRequestHandler *theHandler = [parameters objectForKey:@"qcrequest handler"];
        [theHandler dispatchToECO:@"missingValue" withParameters:parameters];
        return QC_STACK_EXIT;
    }
    NSURL *url = [NSURL URLWithString:aUrl];
    [parameters setObject:url forKey:@"url"];
    
    return QC_STACK_CONTINUE;
}
@end
